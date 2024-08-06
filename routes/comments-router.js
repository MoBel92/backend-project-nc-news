const express = require("express");
const commentsRouter = express.Router();
const {
  deleteComment,
  postCommentForArticle,
} = require("../controller/nc-controllers");

commentsRouter
  .route("/:comment_id")
  .delete(deleteComment)
  .patch(postCommentForArticle);

module.exports = commentsRouter;
