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
    id: {
      type: String,
      hashKey: true,
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
    author_id: {
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
    language: {
      type: String,
      required: true
    },
    runner_version: {
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

const SurveyRegistryModel = dynamoose.model(
  surveyRegistryTableName,
  surveyRegistrySchema
);

const getQuestionnaire = (id) => {
  return SurveyRegistryModel.get({ id: id });
}

const saveQuestionnaire = (data) => {
  // ToDo - maybe add code to get latest version number in registry
  data.sort_key = `${data.survey_version}_${data.survey_id$}_${data.form_type}_${data.language}`;
  const model = new SurveyRegistryModel(data);
  data.sort_key = `v0_${data.survey_id$}_${data.form_type}_${data.language}`;
  const modelLatest = new SurveyRegistryModel(data);
  return Promise.all([model.save(), modelLatest.save()]);
};


module.exports = {getQuestionnaire, saveQuestionnaire};
