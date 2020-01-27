const express = require("express");

const {
  getSurveyFromPublisher,
  postQuestionnaire,
  getQuestionnairesVersion,
  getQuestionnairesVersionLatest,
  getQuestionnairesPublished
} = require("./middleware");

const app = express();

app.put("/submit", express.json(), getSurveyFromPublisher, postQuestionnaire);

app.post(
  "/questionnaires",
  express.json(),
  getSurveyFromPublisher,
  postQuestionnaire
);

app.get(
  "/questionnaires/latest",
  express.json(),
  getQuestionnairesVersionLatest
);

app.get("/questionnaires/version", express.json(), getQuestionnairesVersion);

app.get(
  "/questionnaires/published",
  express.json(),
  getQuestionnairesPublished
);

app.get("/status", (_, res) => res.sendStatus(200));

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Listening on port", PORT); // eslint-disable-line
});
