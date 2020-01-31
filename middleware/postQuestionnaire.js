const uuid = require("uuid");
const { QuestionnaireModel } = require("../database");

const saveModel = (model, options = {}) =>
  new Promise((resolve, reject) => {
    model.save(options, err => {
      if (err) {
        reject(err);
      }
      resolve(model);
    });
  });

const updateModel = (model, key = {}, update = {}, options = {}) =>
  new Promise((resolve, reject) => {
    model.update(key, update, options, err => {
      if (err) {
        reject(err);
      }
      resolve(model);
    });
  });

const getModel = (model, options = {}) =>
  new Promise((resolve, reject) => {
    model.queryOne(options).exec((err, questionnaire) => {
      if (err) {
        reject(err);
      }
      resolve(questionnaire);
    });
  });

const publishQuestionnaire = async (
  form_type,
  theme,
  language,
  survey_id,
  surveyVersion,
  questionnaire,
  questionnaireId,
  model
) => {
  const updatedQuestionnaire = {
    ...questionnaire,
    form_type,
    theme,
    language
  };

  const { eq_id, data_version, title } = questionnaire;

  const latestQuestionnaireSortKey = `v0_${survey_id}_${form_type}_${language}`;
  const newQuestionnaireVersionSortKey = `v${surveyVersion}_${survey_id}_${form_type}_${language}`;

  const globalRegistryValues = {
    author_id: questionnaireId,
    eq_id,
    survey_id,
    form_type,
    survey_version: surveyVersion,
    runner_version: data_version,
    language,
    title,
    schema: updatedQuestionnaire
  };

  const latestRegistryVersionValues = {
    registry_id: uuid.v4(),
    sort_key: latestQuestionnaireSortKey,
    ...globalRegistryValues
  };

  const newRegistryVersionValues = {
    registry_id: uuid.v4(),
    sort_key: newQuestionnaireVersionSortKey,
    ...globalRegistryValues
  };

  const latestQuestionnaire = await getModel(model, {
    sort_key: latestQuestionnaireSortKey
  });

  const errors = [];

  if (latestQuestionnaire) {
    await updateModel(
      model,
      {
        registry_id: latestQuestionnaire.registry_id
      },
      latestRegistryVersionValues
    )
      .then(() => {
        console.log(`Latest version of ${eq_id} has been updated`);
      })
      .catch(e => {
        errors.push(e);
      });
  } else {
    await saveModel(new model(latestRegistryVersionValues))
      .then(() => {
        console.log(`Latest version of ${eq_id} has been saved`);
      })
      .catch(e => {
        errors.push(e);
      });
  }

  await saveModel(new model(newRegistryVersionValues))
    .then(() => {
      console.log(`Version ${surveyVersion} of ${eq_id} has been saved`);
    })
    .catch(e => {
      errors.push(e);
    });

  if (errors.length) {
    return { code: 500, errors };
  }

  return { code: 200, errors: null };
};

module.exports = async (req, res, next, model = QuestionnaireModel) => {
  if (!req.body || !res.questionnaire) {
    return res.status(400).json();
  }

  const { surveyVersion, publishDetails, questionnaireId } = req.body;

  let status;

  let launchURLs = [];

  loop1: for (const publishDetail of publishDetails) {
    const { surveyId, formType, variants } = publishDetail;

    for (const variant of variants) {
      const { language, theme } = variant;

      status = await publishQuestionnaire(
        formType,
        theme,
        language,
        surveyId,
        surveyVersion,
        res.questionnaire,
        questionnaireId,
        model
      );

      if (status.code != 200) {
        break loop1;
      }

      launchURLs.push({
        surveyId,
        formType,
        url: `${process.env.SURVEY_REGISTER_URL}/questionnaires/version?survey_id=${surveyId}&form_type=${formType}&survey_version=${surveyVersion}`
      });
    }
  }

  if (status.code != 200) {
    return res.status(500).json();
  }

  return res.status(200).json(launchURLs);
};
