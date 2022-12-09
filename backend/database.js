const { MongoClient } = require("mongodb");

var client;
const initDatabase = async ({
  databaseName = "prod", // name of mongo database
  localPort = 27017,
}) => {
  const _client = new MongoClient(
    `mongodb://localhost:${localPort}/${databaseName}`
  );
  client = await _client.connect();
};

exports.initDatabase = initDatabase;
exports.getClient = async () => {
  const tryAgain = (res) => {
    if (client) {
      res(client);
    } else {
      setTimeout(() => {
        tryAgain(res);
      }, 100);
    }
  };
  return new Promise(tryAgain);
};
