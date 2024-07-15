const express = require("express");
const app = express();
const { serverErrorHandler } = require("./error-handlers");
const { getTopics, getEndpoints } = require("./controller/nc-controllers");

// app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.use(serverErrorHandler);

module.exports = app;
