const express = require("express");

const {
  getSurveyFromPublisher,
  insertIntoSurveyRegistry
} = require("./database/interactions");

const { surveyRouter } = require("./middleware");

const app = express();

app.put(
  "/submit",
  express.json(),
  getSurveyFromPublisher,
  insertIntoSurveyRegistry
);
app.get("/surveys", surveyRouter);

app.get("/status", (_, res) => res.sendStatus(200));

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Listening on port", PORT); // eslint-disable-line
});
