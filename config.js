var package = require('./package.json')

var debug = (process.env['NODE_ENV'] !== 'production')

module.exports = {
  debug: debug,
  port: 8080,
  server: {
    name: package.name,
    version: package.version
  },
  database: {
    protocol : "postgres",
    host     : "localhost",
    user     : "postgres",
    database : "orm-restify"
  },
  orm: {
    properties: {},
    instance: {},
    connection: {
      pool: true,
      debug: debug
    }
  }
}