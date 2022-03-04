const express = require("express");
const router = express();

router.get("/", (request, response) => {
  response.json({ test: "passed" });
});

module.exports = router;
