const { QuestionnaireModel } = require("../database");

module.exports = (req, res, next, model = QuestionnaireModel) => {
  const { survey_version, survey_id, form_type } = req.query;

  if (!survey_id || !form_type || !survey_version) {
    return res.status(400).json();
  }

  const sort_key = `v${survey_version}_${survey_id}_${form_type}_en`;

  model
    .queryOne({
      sort_key: sort_key
    })
    .exec((err, survey) => {
      if (err) {
        console.error(err);
        return res.status(500).json();
      }

      if (!survey) {
        return res.status(404).json();
      }

      return res.status(200).json(survey.schema);
    });
};
