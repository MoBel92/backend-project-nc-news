const express = require("express");
const usersRouter = express.Router();
const { getUsers } = require("../controller/nc-controllers");

usersRouter.route("/").get(getUsers);

module.exports = usersRouter;
