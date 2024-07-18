# Northcoders News API

NC News API is a RESTful web API built with Node.js, Express, and PostgreSQL. It serves as the backend for a news aggregation site, providing endpoints for retrieving, creating, updating, and deleting articles, topics, comments, and users.

Hosted Version: You can access the hosted version of the API on this link below :
https://backend-project-nc-news-owan.onrender.com/

**_ The NC News API allows users to: _**

-Retrieve a list of articles, optionally filtered by topic, author, and sorted by various criteria.
-Fetch detailed information for a single article.
-Post, update, and delete comments on articles.
-Get a list of topics and users.
-Vote on articles and comments to increase or decrease their vote count.

**_Getting Started_**

- To get a local copy of this project up and running, follow these steps:

- Ensure you have the following installed on your machine:

-> Node.js (minimum version: 14.x)
-> PostgreSQL (minimum version: 12.x)

**_ Installation _**

- Clone the repository:
  This is how to create the environment variables for anyone who wishes to clone your project and run it locally, please read below:

Step 1 : Clone the Repository:
--> git clone YOUR_REPO_URL then

Step 2 : Create Environment Variable Files:

- Create .env.development, for example--> PGDATABASE=your_development_db
- Create .env.test, for example --> PGDATABASE=your_test_db

last steps is to run some command to install the Dependencies , Set up your Database and seeding it
1- install npm
2- npm run setup-dbs
3- npm run seed

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
