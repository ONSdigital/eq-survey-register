const database = require(process.env.REGISTRY_DATABASE_SOURCE ? './' + process.env.REGISTRY_DATABASE_SOURCE : './dynamo')

module.exports = database
