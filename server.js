const express = require("express");
// const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const port = 8080;

// app.use(cors({ origin: "*" }));

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
