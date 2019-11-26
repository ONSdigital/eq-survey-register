const SurveyRegistryModel = require("..");

module.exports = async (req, res, next) => {
  SurveyRegistryModel.scan().exec((err, surveys) => {
    if (err) {
      res.status(500).send(err);
    }

    let pseudoRes = {};

    surveys.forEach(questionnaire => {
      if (pseudoRes[questionnaire.eq_id]) {
        const pseudoQuestionnaire = pseudoRes[questionnaire.eq_id];
        if (pseudoQuestionnaire.versions < questionnaire.survey_version) {
          pseudoRes[questionnaire.eq_id].versions =
            questionnaire.survey_version;
        }
      }

      if (!pseudoRes[questionnaire.eq_id]) {
        pseudoRes[questionnaire.eq_id] = {
          title: questionnaire.survey.title,
          date_published: questionnaire.date_published,
          register_id: questionnaire.id,
          eq_id: questionnaire.eq_id,
          survey_id: questionnaire.survey_id,
          form_type: questionnaire.form_type,
          versions: questionnaire.survey_version
        };
      }
    });

    const response = Object.values(pseudoRes);

    res.send(response);
  });
};
