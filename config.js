var package = require('./package.json')

var debug = (process.env['NODE_ENV'] !== 'production')

module.exports = {
  debug: debug,
  port: process.env['PORT'] || 8080,
  server: {
    name: package.name,
    version: package.version
  },
  database: process.env['DATABASE'] || "postgres://postgres@localhost/orm-restify",
  orm: {
    properties: {},
    instance: {},
    connection: {
      pool: true,
      debug: debug
    }
  }
}