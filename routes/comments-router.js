const express = require("express");
const commentsRouter = express.Router();
const { deleteComment } = require("../controller/nc-controllers");

commentsRouter.route("/:comment_id").delete(deleteComment);

module.exports = commentsRouter;
