const getQuestionnaireFromPublisher = require("./getQuestionnaireFromPublisher");
const getQuestionnaireFromRegistry = require("./getQuestionnaireFromRegistry");
const getQuestionnaireSummary = require("./getQuestionnaireSummary");
const insertIntoRegistry = require("./insertIntoRegistry");
const insertSchemaIntoRegistry = require("./insertSchemaIntoRegistry");

module.exports = {
  getQuestionnaireFromPublisher,
  getQuestionnaireFromRegistry, 
  getQuestionnaireSummary,
  insertIntoRegistry,
  insertSchemaIntoRegistry
};
