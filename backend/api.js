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
    const { board } = request.body;
    if (board) {
      console.log("received game results");
      console.log(board);
      const client = getClient();
      try {
        await client.connect();
        const db = await client.db("prod");
        const collection = await db.collection("games");
        await collection.insertOne({ board });
      } catch (e) {
        console.log(e);
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    }
  }
});

router.get("/get-game-results", async (request, response) => {
  const client = getClient();
  try {
    await client.connect();
    const pipeline = [{ $group: { _id: "$stars", count: { $sum: 1 } } }];
    const result = await client
      .db("prod")
      .collection("games")
      .aggregate(pipeline);
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
