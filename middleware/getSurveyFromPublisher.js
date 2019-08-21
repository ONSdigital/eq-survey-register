const request = require("request-promise-native");

const { PUBLISHER_URL } = process.env;

module.exports = async (req, res, next) => {
  const questionnaireId = req.params.questionnaireId;
  const options = {
    json: true,
    uri: `${PUBLISHER_URL}${questionnaireId}`
  };
  await request(options)
    .then(response => (res.questionnaire = response))
    .catch(e => {
      res.status(500).send({
        message: "Sorry, something went wrong with the Publisher request"
      });
      next(e);
    });
  next();
};
