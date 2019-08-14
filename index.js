const express = require("express");

const {
  getSurveyFromRegistry,
  getSurveyFromPublisher,
  insertIntoSurveyRegister
} = require("./middleware");

const app = express();

app.get(
  "/submit/:questionnaireId",
  getSurveyFromPublisher,
  insertIntoSurveyRegister
);

app.get("/retrieve/:questionnaireId", getSurveyFromRegistry);

app.get("/status", (_, res) => res.sendStatus(200));

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Listening on port", PORT); // eslint-disable-line
});
