const { getQuestionnaireSummary: getSummary } = require("../database")

const getQuestionnaireSummary = async (req, res, next) => {
  try {
    const Questionnaires = await getSummary(req.latest)
    res.status(200).json(Questionnaires)
  }
  catch (e) {
    console.log(e)
    res.status(500).json({ message: "Error listing all questionnaires" })
  }
}

module.exports = getQuestionnaireSummary
