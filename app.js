const express = require("express");
const app = express();
const { serverErrorHandler } = require("./error-handlers");
const { getTopics } = require("./controller/nc-controllers");

// app.use(express.json());

app.get("/api/topics", getTopics);
app.use(serverErrorHandler);

module.exports = app;
