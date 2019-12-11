const QuestionnaireModel = require("../database/model");

module.exports = async (req, res, next) => {
  const { survey_version, survey_id, form_type } = req.body;

  const sort_key = `v${survey_version}_${survey_id}_${form_type}_en`;

  QuestionnaireModel.queryOne({
    sort_key: sort_key
  }).exec((err, survey) => {
    if (err) {
      res
        .status(500)
        .send("Sorry, something went wrong whilst retrieving the questionnaire")
        .next(err);
    }

    if (!survey) {
      res
        .status(404)
        .send("Sorry, that questionnaire does not exist or is unavailable.");
    }

    res.status(200).send(survey);
  });
};
