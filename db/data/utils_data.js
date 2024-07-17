const db = require("../connection");

const checkIfArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return false;
      } else if (rows.length === 1) {
        return true;
      }
    });
};

const checkIfUserExists = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1;", [username])
    .then(({ rows }) => {
      return rows.length > 0;
    });
};

module.exports = { checkIfArticleExists, checkIfUserExists };
