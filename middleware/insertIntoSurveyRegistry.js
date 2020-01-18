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
  let error = false;
  Object.keys(formTypes).forEach (key => {
    const questionnaire = res.questionnaire;
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
    database.saveModel(model)
    .then((response) => {
      console.log("record saved");
    })
    .catch((response) => {
      console.log("record not saved");
      error = true;
    });
  });
  
  if (error){
    res.status(500).json({
      message: "Sorry, something went wrong inserting into the register"
    });
    next();
  }

  res.json({
    publishedSurveyUrl: `${GO_QUICK_LAUNCHER_URL}${SURVEY_REGISTER_URL}/retrieve/${
      res.questionnaire.eq_id
    }?${Date.now()}`
  });
  next();
};
