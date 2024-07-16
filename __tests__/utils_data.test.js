const { checkIfArticleExists } = require("../db/data/utils_data");
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
