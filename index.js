const express = require("express");

const {
  getSurveyFromPublisher,
  insertIntoSurveyRegistry,
  getVersionOfQuestionnaire,
  getLatestVersionOfQuestionnaire,
  getPublishedQuestionnaires
} = require("./middleware");

const app = express();

app.put(
  "/submit",
  express.json(),
  getSurveyFromPublisher,
  insertIntoSurveyRegistry
);

app.get(
  "/published-questionnaires",
  express.json(),
  getPublishedQuestionnaires
);
app.get("/questionnaire", express.json(), getLatestVersionOfQuestionnaire);
app.get("/questionnaire/version", express.json(), getVersionOfQuestionnaire);

app.get("/status", (_, res) => res.sendStatus(200));

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Listening on port", PORT); // eslint-disable-line
});
