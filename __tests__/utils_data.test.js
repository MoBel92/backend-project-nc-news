const {
  checkIfArticleExists,
  checkIfUserExists,
  checkTopicExists,
  fetchCommentCount,
} = require("../db/data/utils_data");
const db = require("../db/connection");

afterAll(() => {
  return db.end();
});

describe("checkIfArticleExists", () => {
  test("should return true if the article is exist", () => {
    return checkIfArticleExists(1).then((result) => {
      expect(result).toBe(true);
    });
  });
  test("should return false if the article doesnt exist", () => {
    return checkIfArticleExists(99).then((result) => {
      expect(result).toBe(false);
    });
  });
});

describe("checkIfUserExists", () => {
  test("should return true if the user is exist", () => {
    const username = "butter_bridge";
    return checkIfUserExists(username).then((result) => {
      expect(result).toBe(true);
    });
  });
  test("should return false if the user doesnt exist", () => {
    const username = "mohamed";
    return checkIfUserExists(username).then((result) => {
      expect(result).toBe(false);
    });
  });
});

describe("checkTopicExists", () => {
  test("should return true if the topic is exist", () => {
    const slug = "mitch";
    return checkTopicExists(slug).then((result) => {
      expect(result).toBe(true);
    });
  });
  test("should return false if the topic doesnt exist", () => {
    const slug = "mohamed";
    return checkTopicExists(slug).then((result) => {
      expect(result).toBe(false);
    });
  });
});

describe("fetchCommentCount", () => {
  test("should return the comment_count if of the the given article_id", () => {
    const articleId = 1;
    return fetchCommentCount(articleId).then((result) => {
      expect(result).toEqual(11);
    });
  });
});
