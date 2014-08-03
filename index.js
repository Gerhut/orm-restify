#!/usr/bin/env node
var orm = require('orm')
var restify = require('restify')

var config = require('./config')
var apps = require('./apps')

orm.settings.set('properties', config.orm.properties)
orm.settings.set('instance', config.orm.instance)
orm.settings.set('connection', config.orm.connection)

restify.CORS.ALLOW_HEADERS.push('authorization')

var db = orm.connect(config.database)

var server = restify.createServer(config.server)

server.pre(function (req, res, next) {
  req.models = db.models
  next()
})

server.pre(function (req, res, next) {
  req.origin = req.headers.origin || (req.isSecure() ? 'https://' : 'http://') + req.header('Host')
  next()
})

if (config.debug) {
  server.pre(function (req, res, next) {
    console.log(req.log.serializers.req(req))
    next()
  })
}

server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser({ mapParams: false }))
server.use(restify.bodyParser({ maxBodySize: 1024 * 1024 }))
server.use(restify.authorizationParser())
server.use(restify.CORS())
server.use(restify.gzipResponse())

apps(db, server)

db.sync(function () {
  console.log('Database synchronized.')
  server.listen(config.port, function () {
    console.log('Server listening on ' + config.port)
  })
})
