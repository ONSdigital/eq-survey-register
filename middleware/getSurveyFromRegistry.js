const SurveyRegistryModel = require("../database/model");

module.exports = async (req, res, next) => {
  const eq_id = req.query.eq_id;
  const version = req.query.version;

  SurveyRegistryModel.scan(
    {
      eq_id: eq_id,
      survey_version: version
    },
    { conditionalOperator: "AND" }
  ).exec((err, result) => {
    if (err) {
      res
        .status(500)
        .send("Sorry, something went wrong whilst retrieving the questionnaire")
        .next(e);
    }

    if (result.length < 1) {
      res
        .status(404)
        .send("Sorry, that questionnaire does not exist or is unavailable.");
    }

    res.status(200).send(result[0]);
  });
};
