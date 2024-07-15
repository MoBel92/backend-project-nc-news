const { fetchTopics } = require("../model/nc-models");

const getTopics = (request, response, next) => {
  console.log(fetchTopics);
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      // console.log(err);
      next(err);
    });
};

module.exports = { getTopics };
