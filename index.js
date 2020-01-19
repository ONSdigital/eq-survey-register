const express = require("express");

const {
  getSQuestionnaireFromRegistry,
  getQuestionnaireFromPublisher,
  insertIntoSurveyRegistry
} = require("./middleware");

const app = express();

app.put(
  "/submit",
  express.json(),
  getQuestionnaireFromPublisher,
  insertIntoSurveyRegistry
);

app.get("/retrieve/:id", getQuestionnaireFromRegistry);

app.get("/status", (_, res) => res.sendStatus(200));

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Listening on port", PORT); // eslint-disable-line
});
