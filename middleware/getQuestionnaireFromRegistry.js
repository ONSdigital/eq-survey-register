const database = require("../database")

const getQuestionnaireFromRegistry = async (req, res, next) => {
  const requestParams = {}
  let data

  try {
    Object.assign(requestParams, req.body)
    Object.assign(requestParams, req.query)
    Object.assign(requestParams, req.params)

    data = await database.getQuestionnaire(requestParams)
    if (!data) {
      res.status(500).json({ message: "No record found" })
    }
    else {
      res.status(200).json(data)
    }
    next()
  }
  catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Sorry, could not retrieve the schema from the register"
    })
    next()
  }
}

module.exports = getQuestionnaireFromRegistry
