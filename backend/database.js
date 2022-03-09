const tunnel = require("tunnel-ssh");
const { MongoClient } = require("mongodb");

var client;
const initDatabase = ({
  host,
  username,
  privateKey,
  databaseName = "prod", // name of mongo database

  // optional
  localPort,
  dstPort,
}) => {
  if (!host || host == "localhost" || host == "127.0.0.1") {
    client = new MongoClient(`mongodb://localhost:27017/${databaseName}`);
  } else {
    tunnel(
      {
        host,
        username,
        privateKey,
        dstPort: dstPort || 27017,
        localPort: localPort || 27000,
        // keepAlive:true,
      },
      async (error, tnl) => {
        if (error) {
          console.log("SSH connection error: " + error);
        }

        client = new MongoClient(`mongodb://localhost:27017/${databaseName}`);
      }
    );
  }
};

exports.initDatabase = initDatabase;
exports.getClient = () => {
  return client;
};

// async function run() {
//   try {
//     // Connect the client to the server
//     await client.connect();
//     // Establish and verify connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Connected successfully to server");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
