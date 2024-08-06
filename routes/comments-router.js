const express = require("express");
const commentsRouter = express.Router();
const {
  deleteComment,
  updateComment,
} = require("../controller/nc-controllers");

commentsRouter.route("/:comment_id").delete(deleteComment).patch(updateComment);

module.exports = commentsRouter;
