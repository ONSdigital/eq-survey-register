const { QuestionnaireModel, dynamoose } = require("../database");

module.exports = async (req, res, next) => {
  if (!req.body) {
    return res.status(401).json();
  }
  const { survey_id, form_type } = req.body;

  const sort_key = `v0_${survey_id}_${form_type}_en`;

  QuestionnaireModel.queryOne({
    sort_key: sort_key
  }).exec((err, survey) => {
    if (err) {
      res.status(500).json();
    }

    if (!survey) {
      res.status(404).json();
    }
    res.status(200).json(survey.schema);
  });
};
