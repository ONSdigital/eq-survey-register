const uuid = require("uuid");
const { QuestionnaireModel } = require("../database");

const themeLookup = {
  "Northern Ireland": "northernireland",
  ONS: "default",
  Social: "social",
  "UKIS Northern Ireland": "ukis_ni",
  "UKIS ONS": "ukis"
};

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

module.exports = async (req, res, next, model = QuestionnaireModel) => {
  if (!req.body || !res.questionnaire) {
    return res.status(401).json();
  }

  const { formTypes } = req.body;
  const pSurveys = Object.keys(formTypes).map(async key => {
    const questionnaire = Object.assign({}, res.questionnaire);
    questionnaire.theme = themeLookup[key];
    questionnaire.form_type = formTypes[key];

    const { eq_id, survey_id, form_type, data_version, title } = questionnaire;
    const { surveyVersion, questionnaireId } = req.body;

    const latestQuestionnaireSortKey = `v0_${survey_id}_${form_type}_en`;
    const newQuestionnaireVersionSortKey = `v${surveyVersion}_${survey_id}_${form_type}_en`;

    const globalQuestionnaireValues = {
      author_id: questionnaireId,
      eq_id,
      survey_id,
      form_type,
      survey_version: surveyVersion,
      runner_version: data_version,
      language: "en",
      title,
      schema: questionnaire
    };

    const latestQuestionnaireValues = {
      registry_id: uuid.v4(),
      sort_key: latestQuestionnaireSortKey,
      ...globalQuestionnaireValues
    };

    const newQuestionnaireVersionValues = {
      registry_id: uuid.v4(),
      sort_key: newQuestionnaireVersionSortKey,
      ...globalQuestionnaireValues
    };

    const latestQuestionnaire = await getModel(model, {
      sort_key: latestQuestionnaireSortKey
    });

    if (latestQuestionnaire) {
      updateModel(
        model,
        {
          registry_id: latestQuestionnaire.registry_id
        },
        latestQuestionnaireValues
      )
        .then(() => {
          console.log(
            `Latest version of ${res.questionnaire.eq_id} has been updated`
          );
        })
        .catch(e => res.status(500).json());
    } else {
      saveModel(new model(latestQuestionnaireValues))
        .then(() => {
          console.log(`Latest version of ${eq_id} has been saved`);
        })
        .catch(e => res.status(500).json());
    }

    saveModel(new model(newQuestionnaireVersionValues))
      .then(() => {
        console.log(`Version ${surveyVersion} of ${eq_id} has been saved`);
      })
      .catch(e => res.status(500).json());
  });

  await Promise.all(pSurveys);

  return res.status(200).json();
};
