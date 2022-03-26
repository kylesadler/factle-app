const express = require("express");
const compression = require("compression");
// const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const port = 8080;
const { initDatabase } = require("./backend/database");
const fs = require("fs");

initDatabase({
  host: "96.30.198.238",
  username: "mongotunnel",
  // privateKey: fs.readFileSync("/Users/kyle/.ssh/id_rsa"),
  privateKey: fs.readFileSync("./ssh/id_rsa"),
});
// app.use(cors({ origin: "*" }));

app.use(compression());
app.use(express.json());

// connect api routes from "backend/api.js" to "/api" url prefix
app.use("/api", require("./backend/api"));

// serve built React app from frontend/dist/
const staticDir = `${__dirname}/frontend/dist/`;
app.use(express.static(staticDir));
app.get("*", (req, res) => {
  res.sendFile(`${staticDir}/index.html`);
});

var listener = server.listen(port, () => {
  console.log("Server started at port: " + listener.address().port);
});
