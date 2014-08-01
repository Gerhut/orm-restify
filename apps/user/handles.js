var _ = require('lodash')
var restify = require('restify')

exports.authorization = authorization
exports.register = register
exports.changePassword = changePassword
exports.getAccess = getAccess
exports.del = del

function authorization(options) {

  options = _.defaults(options || {}, {
    minAccess: 0,
    maxAccess: Infinity
  })

  return function (req, res, next) {

    var User = req.models.user

    if (!('basic' in req.authorization))
      return next(new restify.UnauthorizedError('Authorization required.'))

    User.get(req.authorization.basic.username, function (err, result) {
      
      if (err) {
        if (err.code == 2)
          return next(new restify.UnauthorizedError('No such user'))
        return next(err)
      }

      if (!result.valid(req.authorization.basic.password))
        return next(new restify.UnauthorizedError('Invalid password'))

      if (result.access < options.minAccess || result.access > options.maxAccess)
        return next(new restify.UnauthorizedError('Access denied.'))

      req.user = _.pick(result, 'id', 'access')

      return next()
    })
  }
}

function register(options) {

  options = _.defaults(options || {}, {
    access: 0
  })

  return function (req, res, next) {
    
    var User = req.models['user']
    var user = _.pick(req.body, 'id', 'password')

    user.access = options.access

    if (!('id' in user))
      return next(new restify.BadRequestError('Id is required'))
    if (!('password' in user))
      return next(new restify.BadRequestError('Password is required'))
    
    User.create(user, function (err, result) {

      if (err) {
        if (err.code == 23505)
          return next(new restify.ConflictError('User already exists'))
        return next(err)
      }
      
      result = _.pick(result, 'id', 'access')
      res.header('Location', req.origin + '/user/' + result.name)
      res.header('Content-Location', req.origin + '/user/' + result.name)
      res.send(201, result)
      return next()
    })
  }
}

function changePassword() {

  return function (req, res, next) {

    var User = req.models['user']
    var user = _.assign(
      _.pick(req.params, 'id'),
      _.pick(req.body, 'password'))

    if (req.user.id !== user.id)
      return next(new restify.ForbiddenError('Only self allowed.'))
    if (!('password' in user))
      return next(new restify.BadRequestError('Password is required'))

    User.get(user.id, function (err, result) {

      if (err)
        return next(err)

      result.password = user.password

      result.save(function (err) {

        if (err)
          return next(err)

        res.send(204)
        return next()
      })
    })
  }
}

function getAccess(options) {
  
  options = _.defaults(options || {} ,{
    self: true
  })

  return function (req, res, next) {

    var User = req.models['user']
    
    if (options.self && req.user.id !== req.params.id)
      return next(new restify.ForbiddenError('Only self allowed.'))
    
    
    result = _.pick(req.user, 'access')
    res.send(result)
  }
}

function del(options) {
  
  options = _.defaults(options || {}, {
    self: true
  })
  
  return function (req, res, next) {
  
    var User = req.models['user']

    if (options.self && req.user.id !== req.params.id)
      return next(new restify.ForbiddenError('Only self allowed.'))

    User.get(req.params.id, function (err, result) {
      
      if (err) {
        if (err.code == 2)
          return next(new restify.UnauthorizedError('No such user'))
        return next(err)
      }

      result.remove(function (err) {

        if (err)
          return next(err)

        res.send(204)
        return next()
      })
    })
  }
}