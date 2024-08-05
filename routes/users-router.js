const express = require("express");
const usersRouter = express.Router();
const { getUsers, getUserByUsername } = require("../controller/nc-controllers");

usersRouter.route("/").get(getUsers);
usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;
