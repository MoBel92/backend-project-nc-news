const db = require("../db/connection");
const {
  checkIfArticleExists,
  checkIfUserExists,
} = require("../db/data/utils_data");

const fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

const fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};

const fetchArticles = () => {
  return db
    .query(
      `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

const fetchCommentsByArticleId = (article_id) => {
  return checkIfArticleExists(article_id).then((article) => {
    if (!article) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }

    return db
      .query(
        `SELECT comment_id, votes, created_at, author, body, article_id 
         FROM comments 
         WHERE article_id = $1 
         ORDER BY created_at DESC`,
        [article_id]
      )
      .then(({ rows }) => {
        return rows;
      });
  });
};

const addComment = (article_id, username, body) => {
  return checkIfArticleExists(article_id)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }

      return checkIfUserExists(username);
    })
    .then((user) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }

      return db.query(
        `INSERT INTO comments (author, body, article_id)
         VALUES ($1, $2, $3)
         RETURNING *;`,
        [username, body, article_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

const updateArticleById = (article_id, inc_votes) => {
  return checkIfArticleExists(article_id)
    .then(() => {
      return db.query(
        `UPDATE articles
         SET votes = votes + $1
         WHERE article_id = $2
         RETURNING *;`,
        [inc_votes, article_id]
      );
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};
const removeComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};

module.exports = {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addComment,
  updateArticleById,
  removeComment,
};
