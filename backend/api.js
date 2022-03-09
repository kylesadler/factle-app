const express = require("express");
const router = express();
const { getClient } = require("./database");

const getLatestData = async () => {
  return {
    problem: {
      date: "03/09/2022",
      prompt: "Top 5 Most Followed People on Instagram",
      options: [
        "Niki Minaj",
        "Beyonce",
        "Zendaya",
        "Floyd Mayweather",
        "Jerry Seinfeld",

        "Wrong Option France 0",
        "Wrong Option France 1",
        "Wrong Option France 2",
        "Wrong Option France 3",
        "Wrong Option France 4",

        "Wrong Option France 5",
        "Wrong Option France 6",
        "Wrong Option France 7",
        "Wrong Option France 8",
        "Wrong Option France 9",

        "Wrong Option France 10",
        "Wrong Option France 11",
        "Wrong Option France 12",
        "Wrong Option France 13",
        "Wrong Option France 14",

        "Wrong Option France 15",
        "Wrong Option France 16",
        "Wrong Option France 17",
      ],
    },
    config: {
      popup: {
        headerText: "A Test Popup",
        messageText: "This is something I want to say.",
        callToActionText: "Check this out",
        link: "https://twitter.com",
        buttonColor: "#6aaa64",
      },
      bannerText: "A test banner. We support Ukraine.",
      statisticsPageText: "Here is something I want to say",
    },
  };
};

var appData = null;

router.get("/get-app-data", async (request, response) => {
  if (!appData) {
    appData = await getLatestData();
  }
  response.json(appData);
});

router.post("/send-game-results", async (request, response) => {
  if (request.body) {
    const { board, date } = request.body;
    if (board) {
      console.log("received game results");
      console.log(board);
      const client = getClient();
      try {
        await client.connect();
        const db = await client.db("prod");
        const collection = await db.collection("games");
        await collection.insertOne({ board, date });
      } catch (e) {
        console.log(e);
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    }
  }
});

const getCentralTimeDate = () => {
  const centralTime = new Date(
    new Date().getTime() + new Date().getTimezoneOffset() * 60000 + 3600000 * -6
  );

  var dd = String(centralTime.getDate()).padStart(2, "0");
  var mm = String(centralTime.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = centralTime.getFullYear();

  return mm + "/" + dd + "/" + yyyy;

  // "03/09/2022"
};

router.get("/get-game-results", async (request, response) => {
  const client = getClient();
  try {
    await client.connect();
    // prettier-ignore
    const pipeline = [
      { $match: { "date": getCentralTimeDate() } },
      { $replaceRoot: { newRoot: "$board" } },
    ];
    const db = await client.db("prod");

    const collection = await db.collection("games");
    const pointer = await collection.aggregate(pipeline);
    const result = [];
    for await (const doc of pointer) {
      result.push(doc);
    }
    console.log("got results", result);

    response.json(result);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

// update data every minute
// setInterval(async () => {
//   appData = await getLatestData();
// }, 60 * 1000);

module.exports = router;
