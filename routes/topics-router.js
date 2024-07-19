const express = require("express");
const topicsRouter = express.Router();
const { getTopics } = require("../controller/nc-controllers");

topicsRouter.route("/").get(getTopics);

module.exports = topicsRouter;
