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
      .expect(200)
      .then((response) => {
        //console.log(response.body);
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
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });

  test("400: responds with an error message when article_id is not valid", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request");
      });
  });
  test("responds with article details including comment_count", () => {
    return request(app)
      .get(`/api/articles/1`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id");
        expect(body.article).toHaveProperty("title");
        expect(body.article).toHaveProperty("author");
        expect(body.article).toHaveProperty("topic");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article).toHaveProperty("votes");
        expect(body.article).toHaveProperty("comment_count");
        expect(typeof body.article.comment_count).toBe("number");
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
  test("200: responds with articles filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(
          body.articles.every((article) => article.topic === "mitch")
        ).toBe(true);
      });
  });
  test("200: responds with articles sorted by sort_by and order", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=asc")
      .expect(200)
      .then(({ body }) => {
        const createdAtValues = body.articles.map(
          (article) => article.created_at
        );

        expect(createdAtValues).toEqual(createdAtValues.slice().sort());
      });
  });
  test("400: responds with error for invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_column")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid query");
      });
  });
  test("400: responds with an error when order query is invalid", () => {
    return request(app)
      .get("/api/articles?order=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid query");
      });
  });

  test("200: responds with an empty array when there are no articles for the given topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
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
  test("200: returns an empty array when there are no comments for the article", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBe(0);
      });
  });

  test("404: responds with an error message when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });

  test("400: responds with an error message when article_id is not valid", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with the posted comment", () => {
    const newComment = {
      username: "lurker",
      body: "Love northcoders",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: expect.any(Number),
          body: "Love northcoders",
          article_id: 1,
          author: "lurker",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  test("201: ignores unnecessary properties", () => {
    const newComment = {
      username: "lurker",
      body: "Love northcoders",
      extraProperty: "This should be ignored",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: expect.any(Number),
          body: "Love northcoders",
          article_id: 1,
          author: "lurker",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  test("400: responds with an error when username is missing", () => {
    const newComment = {
      body: "Love northcoders",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: responds with an error when body is missing", () => {
    const newComment = {
      username: "lurker",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: responds with an error when article_id does not exist", () => {
    const newComment = {
      username: "lurker",
      body: "Love northcoders",
    };

    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });

  test("404: responds with an error when username does not exist", () => {
    const newComment = {
      username: "MohamedBelhaj",
      body: "Love northcoders",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });

  test("400: responds with an error when article_id is not valid", () => {
    const newComment = {
      username: "lurker",
      body: "Love northcoders",
    };

    return request(app)
      .post("/api/articles/not-a-number/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with the updated article", () => {
    const voteVar = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/1")
      .send(voteVar)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          topic: "mitch",
          author: "butter_bridge",
          created_at: expect.any(String),
          votes: 101,
          article_img_url: expect.any(String),
        });
      });
  });

  test("200: responds with the updated article when votes are decremented", () => {
    const voteVar = { inc_votes: -100 };

    return request(app)
      .patch("/api/articles/1")
      .send(voteVar)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(0);
      });
  });

  test("400: responds with an error when inc_votes is missing", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("inc_votes is required");
      });
  });

  test("404: responds with an error when article_id does not exist", () => {
    const voteVar = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/999")
      .send(voteVar)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });

  test("400: responds with an error when article_id is not valid", () => {
    const voteVar = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/not-a-number")
      .send(voteVar)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("DELETE", () => {
  test("204: deletes a comment from the database b given a comment_id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("404: responds with an error message when given comment id does not exist", () => {
    return request(app)
      .delete("/api/comments/987")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });

  test("400: responds with an error message when given invalid comment id", () => {
    return request(app)
      .delete("/api/comments/not-a-comment")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});

describe("GET /api/articles, for sort_by query", () => {
  test("?sort_by= responds with array of articles ordered by the given sort_by query column, defaults to the created_at date", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test('400: responds with "invalid query" error message when given an invalid sort_by query', () => {
    return request(app)
      .get("/api/articles?sort_by=invalid-query")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid query");
      });
  });
});

describe("GET /api/articles, for order query", () => {
  test("?order=desc responds with array of articles ordered by descending order of created_at date", () => {
    return request(app)
      .get("/api/articles?order=desc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("?order=asc responds with array of articles ordered by ascending order of created_at date", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy("created_at", { descending: false });
      });
  });

  test('400: responds with "invalid order" error message when given an invalid order query', () => {
    return request(app)
      .get("/api/articles?order=invalid-order")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid query");
      });
  });
});
