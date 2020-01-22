const express = require("express");

const {
  getQuestionnaireFromRegistry,
  getQuestionnaireFromPublisher,
  insertIntoSurveyRegistry, 
  getQuestionnaireSummary,
  insetSchemaIntoSurveyRegistry,
} = require("./middleware");

const app = express();

app.put(
  "/submit",
  express.json(),
  getQuestionnaireFromPublisher,
  insertIntoSurveyRegistry
);

app.put(
  "/submit-json",
  express.json(),
  insetSchemaIntoSurveyRegistry
);

app.get("/retrieve", express.json(), getQuestionnaireFromRegistry);
app.get("/retrieve/id/:id", getQuestionnaireFromRegistry);
app.get("/retrieve/id/:id/version/:version", getQuestionnaireFromRegistry);
app.get("/retrieve/survey_id/:survey_id/form_type/:formtype", getQuestionnaireFromRegistry);
app.get("/retrieve/survey_id/:survey_id/form_type/:formtype/language/:language", getQuestionnaireFromRegistry);
app.get("/retrieve/survey_id/:survey_id/form_type/:formtype/version/:version", getQuestionnaireFromRegistry);
app.get("/retrieve/survey_id/:survey_id/form_type/:formtype/language/:language/version/:version", getQuestionnaireFromRegistry);

app.get("/summary-latest", 
  express.json(),
  (req, res, next) => {req.latest = true, next()}, 
  getQuestionnaireSummary
);

app.get("/summary-all", 
  express.json(),
  (req, res, next) => {req.latest = false, next()}, 
  getQuestionnaireSummary
);

app.get("/status", (_, res) => res.sendStatus(200));

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Listening on port", PORT); // eslint-disable-line
});
