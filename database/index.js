const database = require(process.env.DATABASE? './' + process.env.DATABASE : './dynamo');

module.exports = database;