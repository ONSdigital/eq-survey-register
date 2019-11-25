const dynamoose = require("dynamoose");

let throughput = "ON_DEMAND";

let surveyRegistryTableName = "survey-registry";

if (process.env.DYNAMODB_ENDPOINT_OVERRIDE) {
  dynamoose.local(process.env.DYNAMODB_ENDPOINT_OVERRIDE);
  throughput = { read: 10, write: 10 }; // DynamoDB local doesn't yet support on-demand
}

if (process.env.DYNAMO_SURVEY_REGISTRY_TABLE_NAME) {
  surveyRegistryTableName = process.env.DYNAMO_SURVEY_REGISTRY_TABLE_NAME;
}

const surveyRegistrySchema = new dynamoose.Schema(
  {
    registry_id: {
      type: String,
      hashKey: true,
      required: true
    },
    author_id: {
      type: String,
      required: true
    },
    eq_id: {
      type: String,
      required: true
    },
    survey_id: {
      type: String,
      required: true
    },
    form_type: {
      type: String,
      required: true
    },
    survey_version: {
      type: String,
      required: true
    },
    runner_version: {
      type: String,
      required: true
    },
    sort_key: {
      type: String,
      required: true,
      index: {
        global: true,
        name: "sortKey"
      }
    },
    language: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    schema: {
      type: Object,
      require: true
    }
  },
  {
    throughput: throughput,
    timestamps: true
  }
);

const QuestionnaireModel = dynamoose.model(
  surveyRegistryTableName,
  surveyRegistrySchema
);

module.exports = {
  QuestionnaireModel,
  dynamoose
};
