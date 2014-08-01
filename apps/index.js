module.exports = function (db, server) {
  var user = require('./user')(db)

  server.post('/user',
    user.register())

  server.get('/user/:id',
    user.authorization(),
    user.getAccess())

  server.put('/user/:id',
    user.authorization(),
    user.changePassword())

  server.del('/user/:id',
    user.authorization({minAccess: 1}),
    user.del({self: false}))
}