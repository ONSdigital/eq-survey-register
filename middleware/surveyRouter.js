const { getAllSurveysFromRegistry } = require("../database/interactions");

module.exports = (req, res, next) => {
  const queryParams = req.query;
  const numOfParams = Object.keys(queryParams).length;

  if (numOfParams == 0) {
    return getAllSurveysFromRegistry(req, res, next);
  }

  if (queryParams["eq_id"] && queryParams["version"]) {
    res.send("OK");
  }

  res.status(200);
};
