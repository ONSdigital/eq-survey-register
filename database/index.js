const SurveyRegistryModel = require(process.env.DATASTORE? './' + process.env.DATASTORE : './dynamo');

module.exports = SurveyRegistryModel;