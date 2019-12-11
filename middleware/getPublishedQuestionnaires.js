const QuestionnaireModel = require("../database/model");

module.exports = async (req, res, next) => {
  QuestionnaireModel.scan("sort_key")
    .beginsWith("v0_")
    .exec((err, questionnaires) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (!questionnaires || questionnaires.length < 1) {
        return res
          .status(404)
          .send("Sorry, there are no published questionnaires");
      }

      const publishedQuestionnaires = questionnaires.map(questionnaire => ({
        registry_id: questionnaire.registry_id,
        survey_id: questionnaire.survey_id,
        form_type: questionnaire.form_type,
        title: questionnaire.title,
        lastPublished: questionnaire.updatedAt,
        survey_version: questionnaire.survey_version
      }));

      return res.status(200).send(publishedQuestionnaires);
    });
};
