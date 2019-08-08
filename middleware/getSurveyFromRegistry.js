const SurveyRegistryModel = require("../database");

module.exports = async (req, res, next) => {
  const questionnaireId = req.params.questionnaireId;
  const questionnaire = await new Promise((resolve, reject) => {
    SurveyRegistryModel.queryOne({ eq_id: { eq: questionnaireId } }).exec(
      (err, questionnaire) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(questionnaire);
      }
    );
  });
  res.send(questionnaire);
  next();
};
