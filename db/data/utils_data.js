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

const checkTopicExists = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
      return rows.length > 0;
    });
};

const fetchCommentCount = (article_id) => {
  return db
    .query(
      "SELECT COUNT(comment_id)::INT AS comment_count FROM comments WHERE article_id = $1",
      [article_id]
    )
    .then(({ rows }) => {
      return rows[0].comment_count;
    });
};
module.exports = {
  checkIfArticleExists,
  checkIfUserExists,
  checkTopicExists,
  fetchCommentCount,
};
