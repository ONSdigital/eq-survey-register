const getVersionOfQuestionnaire = require("./getVersionOfQuestionnaire");
const getSurveyFromPublisher = require("./getSurveyFromPublisher");
const insertIntoSurveyRegistry = require("./insertIntoSurveyRegistry");
const getLatestVersionOfQuestionnaire = require("./getLatestVersionOfQuestionnaire");
const getPublishedQuestionnaires = require("./getPublishedQuestionnaires");

module.exports = {
  getVersionOfQuestionnaire,
  getSurveyFromPublisher,
  insertIntoSurveyRegistry,
  getLatestVersionOfQuestionnaire,
  getPublishedQuestionnaires
};
