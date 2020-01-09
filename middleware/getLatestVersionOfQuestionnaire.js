const { QuestionnaireModel } = require("../database");

module.exports = (req, res, next, model = QuestionnaireModel) => {
  if (!req.body) {
    return res.status(401).json();
  }
  const { survey_id, form_type } = req.body;

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
