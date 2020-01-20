const { getQuestionnaireSummary } = require("../database");

module.exports = async (req, res, next) => {
    try{
        const Questionnaires = await getQuestionnaireSummary(req.latest);
        res.status(200).json(Questionnaires);
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "Error listing all questionnaires"})
    }
  
};