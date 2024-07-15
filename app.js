const express = require("express");
const app = express();
const { serverErrorHandler, psqlErrorHandler } = require("./error-handlers");
const {
  getTopics,
  getEndpoints,
  getArticleById,
} = require("./controller/nc-controllers");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);

app.use(psqlErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
