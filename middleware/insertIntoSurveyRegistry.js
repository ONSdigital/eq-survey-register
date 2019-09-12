const SurveyRegistryModel = require("../database");

const { GO_QUICK_LAUNCHER_URL, SURVEY_REGISTER_URL } = process.env;

const saveModel = (model, options = {}) =>
  new Promise((resolve, reject) => {
    model.save(options, err => {
      if (err) {
        reject(err);
      }
      resolve(model);
    });
  });

module.exports = async (req, res, next) => {
  await saveModel(
    new SurveyRegistryModel({
      ...res.questionnaire,
      survey_id: req.params.surveyId,
      form_type: req.params.formType
    })
  ).catch(e => {
    res.status(500).send({
      message: "Sorry, something went wrong inserting into the register"
    });
    next(e);
  });
  res.json({
    publishedSurveyUrl: `${GO_QUICK_LAUNCHER_URL}${SURVEY_REGISTER_URL}/retrieve/${
      res.questionnaire.eq_id
    }?${Date.now()}`
  });
  next();
};
