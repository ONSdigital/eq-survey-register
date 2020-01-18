const dynamoose = require("dynamoose");
console.log("Using Dynamo")
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
    id: {
      type: String,
      hashKey: true,
      required: true
    },
    eq_id: {
      type: String,
      required: true
    },
    survey_version: {
      type: Number,
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
    date_published: {
      type: String,
      required: true
    },
    survey: {
      type: Object,
      require: true
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

const getModel = (id) => {
  return SurveyRegistryModel.get({ id: id });
}

const saveModel = (data) => {
  const model = new SurveyRegistryModel(data);
  return model.save();
};


module.exports = {getModel, saveModel};
