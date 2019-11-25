const { QuestionnaireModel } = require("../database");

module.exports = (req, res, next, model = QuestionnaireModel) => {
  if (!req.query.survey_id) {
    return res.status(400).json();
  }

  if (!req.query.form_type) {
    return res.status(400).json();
  }

  const { survey_id, form_type } = req.query;

  const sort_key = `v0_${survey_id}_${form_type}_en`;

  model
    .queryOne({
      sort_key: sort_key
    })
    .exec((err, survey) => {
      if (err) {
        return res.status(500).json();
      }

      if (!survey) {
        return res.status(404).json();
      }
      return res.status(200).json(survey.schema);
    });
};
