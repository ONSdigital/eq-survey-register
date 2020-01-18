const database = require("../database");

const getSurveyFromRegistry = (req, res, next) => {
  const id = req.params.id;
  database.getModel(id)
  .then((data) => {
    if(!data){
      res.status(500).json({ message: "No record found"});
      next();
    }
    res.status(200).json(data);
    next()
  })
  .catch((resopnse) => {
    console.log(response);
    res.status(500).json({
      message: "Sorry, could not retrieve the schema from the register"
    });
    next();
  })
}; 

module.exports = getSurveyFromRegistry;



