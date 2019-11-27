const getVersionOfSurvey = require("./getVersionOfSurvey");
const getSurveyFromPublisher = require("./getSurveyFromPublisher");
const insertIntoSurveyRegistry = require("./insertIntoSurveyRegistry");
const getAllSurveys = require("./getAllSurveys");
const getLatestVersionOfSurvey = require("./getLatestVersionOfSurvey");

module.exports = {
  getVersionOfSurvey,
  getSurveyFromPublisher,
  getAllSurveys,
  insertIntoSurveyRegistry,
  getLatestVersionOfSurvey
};
