exports.psqlErrorHandler = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ message: "Bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ message: "not found" });
  } else if (err.code === "42601") {
    res.status(400).send({ message: "invalid query" });
  } else {
    next(err);
  }
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.serverErrorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const msg = err.msg || "Internal Server Error";

  res.status(status).send({ msg });
};
