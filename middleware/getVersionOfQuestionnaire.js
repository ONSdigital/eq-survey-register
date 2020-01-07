const { QuestionnaireModel } = require("../database");

module.exports = async (req, res, next) => {
  const { survey_version, survey_id, form_type } = req.params;

  const sort_key = `v${survey_version}_${survey_id}_${form_type}_en`;

  QuestionnaireModel.queryOne({
    sort_key: sort_key
  }).exec((err, survey) => {
    if (err) {
      return res
        .status(500)
        .send(
          "Sorry, something went wrong whilst retrieving the questionnaire"
        );
    }

    if (!survey) {
      return res
        .status(404)
        .send("Sorry, that questionnaire does not exist or is unavailable.");
    }

    return res.status(200).send(survey.schema);
  });
};
