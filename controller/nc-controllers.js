const { request, response } = require("../app");
const { fetchTopics, fetchArticleById } = require("../model/nc-models");
const fs = require("fs").promises;

const getTopics = (request, response, next) => {
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      // console.log(err);
      next(err);
    });
};

const getEndpoints = (request, response, next) => {
  fs.readFile(
    "/home/belmo/northcoders/backend-project/be-nc-news/endpoints.json",
    "utf8"
  )
    .then((data) => {
      const endpoints = JSON.parse(data);
      response.status(200).send(endpoints);
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports = { getTopics, getEndpoints, getArticleById };