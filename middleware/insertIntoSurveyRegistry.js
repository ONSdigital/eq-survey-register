const uuid = require("uuid");
const database = require("../database");

const { GO_QUICK_LAUNCHER_URL, SURVEY_REGISTER_URL } = process.env;

const themeLookup = {
  "Northern Ireland": "northernireland",
  ONS: "default",
  Social: "social",
  "UKIS Northern Ireland": "ukis_ni",
  "UKIS ONS": "ukis"
};

module.exports = (req, res, next) => {
  const { surveyId, formTypes, surveyVersion } = req.body;

  const pArray = Object.keys(formTypes).map(key => {
    const questionnaire = Object.assign({}, res.questionnaire);
    questionnaire.theme = themeLookup[key];
    questionnaire.form_type = formTypes[key];
    const model = {
      id: uuid.v4(),
      eq_id: res.questionnaire.eq_id,
      survey_id: surveyId,
      form_type: formTypes[key],
      date_published: Date.now(),
      survey_version: surveyVersion,
      survey: questionnaire
    }
    if (database.saveModel(model)) {
      console.log('Record saved')
      } 
    else {
      console.log('Error saving record')
      res.status(500).send({
        message: "Sorry, something went wrong inserting into the register"
      });
      next()
    } 
    });

  res.json({
    publishedSurveyUrl: `${GO_QUICK_LAUNCHER_URL}${SURVEY_REGISTER_URL}/retrieve/${
      res.questionnaire.eq_id
    }?${Date.now()}`
  });
  next();
};
