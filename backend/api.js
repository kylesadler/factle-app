const express = require("express");
const router = express();
const { getClient } = require("./database");
const { dateToMMDDYYYY, getCentralTime } = require("../util");

const getBodyData = (request) => {
  return request?.body ? request.body : {};
};

const getCollection = async (client, name) => {
  console.log("getting collection", name);
  const db = await client.db("prod");
  return db.collection(name);
};

router.post("/send-game-results", async (request, response) => {
  const { board, date, row, win, options } = getBodyData(request);

  if ([board, date, row, win, options].every((x) => x != undefined)) {
    console.log("received game results");
    console.log(board, date, row, win, options);
    const client = getClient();
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
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
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

router.get("/get-game-results", authenticate, async (request, response) => {
  // router.get("/get-game-results", async (request, response) => {
  // there are always two active questions due to timezones
  // https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  // next day's game starts being played at ~6am CST
  const today = getCentralTime();
  const tommorow = new Date(today);
  tommorow.setDate(today.getDate() + 1);

  const client = getClient();

  const tryAgain = (resolve, reject) => {
    // console.log("client", client);
    if (!client) {
      setTimeout(() => {
        tryAgain(resolve, reject);
      });
    } else {
      resolve();
    }
  };

  await new Promise(tryAgain);

  // console.log("client", client);
  try {
    // await client.connect();
    const todayResults = await getGameStatsByDate(client, today);
    const tomorrowResults = await getGameStatsByDate(client, tommorow);
    const results = { todayResults, tomorrowResults };
    console.log("got results", results);
    response.json(results);
  } finally {
  }
});

module.exports = router;
