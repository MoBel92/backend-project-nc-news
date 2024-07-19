const express = require("express");
const articlesRouter = express.Router();
const {
  getArticleById,
  getArticles,
  postCommentForArticle,
  getCommentsByArticleId,
  updateArticleVotes,
} = require("../controller/nc-controllers");

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentForArticle);

module.exports = articlesRouter;
