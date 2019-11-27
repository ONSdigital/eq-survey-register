const SurveyRegistryModel = require("../database/model");

module.exports = async (req, res, next) => {
  const eq_id = req.params.eqId;

  SurveyRegistryModel.scan({
    eq_id: eq_id
  }).exec((err, surveys) => {
    if (err) {
      res
        .status(500)
        .send("Sorry, something went wrong whilst retrieving the questionnaire")
        .next(err);
    }

    if (surveys.length < 1) {
      res
        .status(404)
        .send("Sorry, that questionnaire does not exist or is unavailable.");
    }

    let pseudoRes;

    surveys.forEach(questionnaire => {
      if (pseudoRes) {
        if (pseudoRes.versions < questionnaire.survey_version) {
          pseudoRes = questionnaire;
        }
      }

      if (!pseudoRes) {
        pseudoRes = questionnaire;
      }
    });

    res.status(200).send(pseudoRes);
  });
};
