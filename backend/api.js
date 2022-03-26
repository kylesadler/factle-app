const express = require("express");
const router = express();
const { getClient } = require("./database");
const {
  dateToMMDDYYYY,
  getCentralTime,
  getCentralTimeMMDDYYYY,
} = require("../util");

const PERCENTILE_UPDATE_MS = 10 * 60 * 1000;

const getBodyData = (request) => {
  return request?.body ? request.body : {};
};

const getCollection = async (client, name) => {
  // console.log("getting collection", name);
  const db = await client.db("prod");
  return db.collection(name);
};

router.post("/send-game-results", async (request, response) => {
  const { board, date, row, win, options } = getBodyData(request);

  if ([board, date, row, win, options].every((x) => x != undefined)) {
    // console.log("received game results");
    // console.log(board, date, row, win, options);
    const client = await getClient();
    try {
      // await client.connect();
      const collection = await getCollection(
        client,
        dateStringToCollection(date)
      );
      await collection.insertOne({ board, date, row, win, options });
    } catch (e) {
      console.log("error when storing results");
      console.log(e);
      response.json({ error: true });
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
      response.json({ success: true });
    }
  }
});

//
//  Database API
//

// TODO make this more secure
const API_SECRET = "qtMui7mM85wiGfQvxcG8W9z9BB4sEy4FjBqxX";

const authenticate = (request, response, next) => {
  // check if user is authenticated

  const { apiKey } = getBodyData(request);

  if (apiKey && apiKey == API_SECRET) {
    next();
  } else {
    response.status(400).json({ error: true });
  }
};

const dateToCollection = (date) => {
  return dateStringToCollection(dateToMMDDYYYY(date));
};

const dateStringToCollection = (dateString) => {
  return `games_${dateString}`;
};

const CountBooleans = (expression) => {
  return {
    $sum: {
      $cond: {
        if: expression,
        then: 1,
        else: 0,
      },
    },
  };
};

const getPipelineResults = async (collection, pipeline) => {
  const pointer = await collection.aggregate(pipeline);

  const result = [];
  for await (const doc of pointer) {
    result.push(doc);
  }

  console.log(`received ${result.length} results`);

  return result;
};

const getGameStats = async (collection) => {
  /*
    total # of games
    total # of wins
    # of games stopping on each board row
    for each board square, average percent correct over all games
    for each answer option, # games in which the option was guessed

    mongo game schema:
      win: true / false
      row: 0-5 (5 is the game was lost)
      board: {
        "00": 0 for incorrect, 1 for correct
        "01": ...
        ...
      }
      options: {"0": true, "1": false, ... } // idx: true if option at index had been guessed
      
  */

  const rowResults = {};
  const boardResults = {};
  const optionResults = {};

  [...Array(6)].forEach((_, x) => {
    rowResults["row" + x] = CountBooleans({
      $eq: ["$row", x],
    });
  });

  [...Array(5)].forEach((__, i) => {
    [...Array(5)].forEach((_, j) => {
      const key = `${i}${j}`;
      boardResults["board" + key] = {
        $sum: `$board.${key}`,
      };
    });
  });

  [...Array(23)].forEach((__, i) => {
    optionResults["option" + i] = CountBooleans({
      $toBool: `$options.${i}`,
    });
  });

  const result = await getPipelineResults(collection, [
    {
      $group: {
        _id: null,
        totalGames: { $sum: 1 },
        wonGames: CountBooleans({
          $toBool: "$win",
        }),

        ...rowResults,
        ...boardResults,
        ...optionResults,
      },
    },
  ]);

  if (result.length == 0) return {};

  const { totalGames, wonGames } = result[0] || {};

  return {
    totalGames,
    wonGames,
    // prettier-ignore
    rowResults: filterPrefix(result[0], "row"),
    boardResults: filterPrefix(result[0], "board"),
    optionResults: filterPrefix(result[0], "option"),
  };
};

const filterPrefix = (object, prefix) => {
  const output = {};
  Object.keys(object)
    .filter((x) => {
      return x.startsWith(prefix);
    })
    .forEach((key) => {
      // console.log(key, prefix, key.slice(prefix.length, key.length));
      output[key.slice(prefix.length, key.length)] = object[key];
    });
  return output;
};

const getGameStatsByDate = async (client, date) => {
  const collection = await getCollection(client, dateToCollection(date));
  return getGameStats(collection);
};

// router.get("/get-game-results", authenticate, async (request, response) => {
router.get("/get-game-results", async (request, response) => {
  // there are always two active questions due to timezones
  // https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  // next day's game starts being played at ~6am CST
  const today = getCentralTime();
  const tommorow = new Date(today);
  tommorow.setDate(today.getDate() + 1);

  const client = await getClient();

  try {
    const todayResults = await getGameStatsByDate(client, today);
    const tomorrowResults = await getGameStatsByDate(client, tommorow);
    const results = { todayResults, tomorrowResults };
    // console.log("got results", results);
    response.json(results);
  } catch (error) {
    console.log(error);
  }
});

const getRowPercentiles = async (collection) => {
  const rowResults = {};

  [...Array(6)].forEach((_, x) => {
    rowResults["row" + x] = CountBooleans({
      $eq: ["$row", x],
    });
  });

  const results = await getPipelineResults(collection, [
    {
      $group: {
        _id: null,
        totalGames: { $sum: 1 },
        ...rowResults,
      },
    },
  ]);

  if (results.length == 0) {
    return {};
  } else {
    const { totalGames } = results[0];
    let currentTotal = 0;
    // technically this an object and we're using integer keys
    const output = filterPrefix(results[0], "row");
    for (let i = 0; i < 6; i++) {
      currentTotal += output[i];
      output[i] = currentTotal / totalGames;
    }
    return output;
  }
};

// { "MM/DD/YYYY": [] array length 6 }
// percentiles[i] is percentile of ending game at row i
// i = 5 is for losing the game
var rowPercentiles = {};

const updateRowPercentiles = async (inputDate) => {
  const date = inputDate || getCentralTimeMMDDYYYY();
  const client = await getClient();
  const collection = await getCollection(client, dateStringToCollection(date));
  rowPercentiles[date] = await getRowPercentiles(collection);
  console.log(`Updating percentiles for ${date}:`, rowPercentiles[date]);
};

updateRowPercentiles();
setInterval(updateRowPercentiles, PERCENTILE_UPDATE_MS);

router.post("/get-row-precentiles", async (request, response) => {
  const { date } = getBodyData(request); // date is MM/DD/YYYY datestring

  // for testing
  // await new Promise((res) => {
  //   setTimeout(res, 5000);
  // });

  if (!rowPercentiles || !rowPercentiles[date]) {
    await updateRowPercentiles(date);
    response.json(rowPercentiles[date]);
  } else {
    response.json(rowPercentiles[date]);
  }
});

module.exports = router;
