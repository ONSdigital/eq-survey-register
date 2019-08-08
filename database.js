const dynamoose = require("dynamoose");

let throughput = "ON_DEMAND";

let surveyRegistryTableName = "survey-registry";

dynamoose.local(process.env.DYNAMODB_ENDPOINT_OVERRIDE);
throughput = { read: 10, write: 10 }; // DynamoDB local doesn't yet support on-demand

if (process.env.DYNAMO_SURVEY_REGISTRY_TABLE_NAME) {
  surveyRegistryTableName = process.env.DYNAMO_SURVEY_REGISTRY_TABLE_NAME;
}

const surveyRegistrySchema = new dynamoose.Schema(
  {
    eq_id: {
      type: String,
      hashKey: true,
      required: true
    },
    form_type: {
      type: String,
      required: true
    },
    mime_type: {
      type: String,
      required: true
    },
    schema_version: {
      type: String,
      required: true
    },
    data_version: {
      type: String,
      required: true
    },
    survey_id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    theme: {
      type: String,
      required: true
    },
    sections: {
      type: Array,
      required: true
    },
    metadata: {
      type: Array,
      required: true
    },
    navigation: {
      type: Object,
      required: true
    },
    view_submitted_response: {
      type: Object,
      required: true
    }
  },
  {
    throughput: throughput
  }
);

const SurveyRegistryModel = dynamoose.model(
  surveyRegistryTableName,
  surveyRegistrySchema
);

module.exports = SurveyRegistryModel;
