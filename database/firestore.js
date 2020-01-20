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
      rangeKey: true,
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
    registry_version: {
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

const getQuestionnaire = (params) => {
  const hash = `${params.survey_id}_${params.form_type}_${params.language || "en"}`;
  const sortKey = `v${params.version || "0"}_`
  return SurveyRegistryModel.get({ id: hash, sort_key: sortKey });
}

const saveQuestionnaire = async (data) => {
  data.id = `${data.survey_id}_${data.form_type}_${data.language}`;
  data.sort_key = `v0_`;
  const currentModel = await SurveyRegistryModel.get({id: data.id, sort_key: data.sort_key});
  if(currentModel){
    data.registry_version = parseInt(currentModel.registry_version) + 1;
  }
  else {
    data.registry_version = 1;
  }
  
  const modelLatest = new SurveyRegistryModel(data);
  data.sort_key = `v${data.registry_version}_`;
  const modelVersion = new SurveyRegistryModel(data);

  return Promise.all([modelVersion.save(), modelLatest.save()]);
};

const getQuestionnaireSummary  = ( latest ) => {
  const attributes = ["id", "sort_key", "survey_id", "form_type", "registry_version", "title", "language"];
  if(latest){
    return SurveyRegistryModel.scan('sort_key').eq("v0_").attributes(attributes).exec();
  }
  else{
    return SurveyRegistryModel.scan('sort_key').not().eq("v0_").attributes(attributes).exec();
  }
}



module.exports = {getQuestionnaire, saveQuestionnaire, getQuestionnaireSummary};
