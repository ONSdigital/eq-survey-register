const database = require("../database");

const getQuestionnaireFromRegistry = async (req, res, next) => {
  try{
    let requestParams;
    if (req.params.id) {
      requestParams = {id: req.params.id, version: req.params.version || "0"};
    }
    else if (req.query.id){
      requestParams = {id: req.query.id, version: req.query.version || "0"};
    }
    else {
      requestParams = req.body;
    }
    const data = await database.getQuestionnaire(requestParams);
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



