const {
  checkIfArticleExists,
  checkIfUserExists,
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
