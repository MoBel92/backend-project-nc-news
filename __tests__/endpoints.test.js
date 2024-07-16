const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const app = require("../app.js");
const endpoints = require("../endpoints.json");
require("jest-extended");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("200: responds with an array of topic objects and each object with their designed properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.topics)).toBe(true);
        expect(response.body.topics.length).toEqual(3);

        response.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });

  test("404: responds with an error message when URL is not found", () => {
    return request(app)
      .get("/api/not-a-valid-url")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
});

describe("GET /api", () => {
  test("200: responds with an object containing all available endpoints", () => {
    return request(app)
      .get("/api")
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toEqual(endpoints);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with an article object by its ID", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article;

        expect(article.article_id).toBe(1);
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("I find this existence challenging");
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });

  test("404: responds with an error message when article is not found", () => {
    return request(app)
      .get("/api/articles/9999847")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });

  test("400: responds with an error message when article_id is not valid", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid article ID");
      });
  });
});

describe("GET /api/articles", () => {
  test("200 status and responds with an array of article objects and with added comment_count property and without body property  ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBeGreaterThan(0);

        body.articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article).not.toHaveProperty("body");
        });
      });
  });

  test("200: responds with an array of articles objects sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("404: responds with an error message when URL is not found", () => {
    return request(app)
      .get("/api/not-a-valid-url")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: status with response of an array of comments for the given article_id of which each comment ", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBeGreaterThan(0);

        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });

  test("200: responds with an array of comments objects with the most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("404: responds with an error message when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("400: responds with an error message when article_id is not valid", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid article ID");
      });
  });
});
