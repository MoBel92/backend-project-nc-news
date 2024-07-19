const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const {
  serverErrorHandler,
  psqlErrorHandler,
  customErrorHandler,
} = require("./error-handlers");

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
