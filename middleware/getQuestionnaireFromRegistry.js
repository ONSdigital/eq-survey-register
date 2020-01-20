const database = require("../database");

const getQuestionnaireFromRegistry = async (req, res, next) => {
  try{
    const data = await database.getQuestionnaire(req.body);
    if(!data){
      res.status(500).json({ message: "No record found"})
    }
    else{
      res.status(200).json(data);
    }
    next()
  }
  catch(e){
    res.status(500).json({
      message: "Sorry, could not retrieve the schema from the register"
    });
    next();
  }
}; 

module.exports = getQuestionnaireFromRegistry;



