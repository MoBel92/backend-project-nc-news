const db = require("../db/connection");
const {
  checkIfArticleExists,
  checkIfUserExists,
  fetchCommentCount,
} = require("../db/data/utils_data");
const { serverErrorHandler } = require("../error-handlers");

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
        return Promise.reject({ status: 404, msg: "not found" });
      }

      const article = rows[0];

      return fetchCommentCount(article_id).then((comment_count) => {
        article.comment_count = parseInt(comment_count, 10);
        return article;
      });
    });
};

const fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
  const validSortBy = [
    "created_at",
    "title",
    "author",
    "topic",
    "votes",
    "article_id",
    "comment_count",
  ];
  const validOrder = ["asc", "desc"];

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid query" });
  }

  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid query" });
  }

  let queryStr = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const queryParams = [];

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryParams.push(topic);
  }

  if (sort_by === "comment_count") {
    queryStr += ` GROUP BY articles.article_id ORDER BY comment_count ${order}`;
  } else {
    queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
  }

  return db.query(queryStr, queryParams).then((data) => {
    if (data.rows.length === 0) {
      return [];
    }
    return data.rows;
  });
};

const fetchCommentsByArticleId = (article_id) => {
  return checkIfArticleExists(article_id).then((article) => {
    if (!article) {
      return Promise.reject({ status: 404, msg: "not found" });
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
        return Promise.reject({ status: 404, msg: "not found" });
      }

      return checkIfUserExists(username);
    })
    .then((user) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: "not found" });
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
        return Promise.reject({ status: 404, msg: "not found" });
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

const selectUsers = () => {
  return db.query(`SELECT * FROM users ;`).then(({ rows }) => {
    return rows;
  });
};

const fetchUsersByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
};

const modifyCommentById = (comment_id, body) => {
  return db
    .query("UPDATE comments SET body = $1 WHERE comment_id = $2 RETURNING *;", [
      body,
      comment_id,
    ])
    .then((result) => result.rows[0]);
};

module.exports = {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addComment,
  updateArticleById,
  removeComment,
  selectUsers,
  fetchUsersByUsername,
  modifyCommentById,
};
