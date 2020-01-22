const database = require("../database");

const getQuestionnaireFromRegistry = async (req, res, next) => {
    let requestParams, data;
    if (req.params.id || (req.params.survey_id && req.params.form_type)) {
      requestParams = req.params;
    }
    else if (req.query.id){
      requestParams = req.query;
    }
    else {
      requestParams = req.body;
    }

    try{ 
      data = await database.getQuestionnaire(requestParams);
      if(!data){
        res.status(500).json({ message: "No record found"});
      }
      else{
        res.status(200).json(data);
      }
      next();
    }
    catch(e){
      console.log(e)
      res.status(500).json({
        message: "Sorry, could not retrieve the schema from the register"
      });
      next();
    }

}; 

module.exports = getQuestionnaireFromRegistry;



