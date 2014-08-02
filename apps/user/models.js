var _ = require('lodash')
var orm = require('orm')
var crypto = require('crypto')

var config = require('./config')

function salt() {
  var value = _.random(parseInt('1000', 36), parseInt('zzzz', 36))
  return value.toString(36)
}

function sha1(password, salt) {
  var sha1 = crypto.createHash('sha1')
  sha1.update(password + salt)
  return sha1.digest('hex')
}

module.exports = function (db) {
  var User = db.define('user', {
    'id': {
      type: 'text',
      key: true
    },
    'password': {
      type: 'text',
      required: true,
      size: 32
    },
    'salt': {
      type: 'text',
      size: 4
    },
    'access'  : {
      type: 'integer',
      size: 2,
      unsigned: true,
      defaultValue: 0
    }
  }, {
    validations: {
      'access': orm.validators.rangeNumber(0, config.maxAccess, 'Invalid access')
    },
    hooks: {
      beforeCreate: function () {
        this.salt = salt()
      },
      beforeSave: function () {
        this.password = sha1(this.password, this.salt)
      }
    },
    methods: {
      valid: function (password) {
        return sha1(password, this.salt) === this.password
      }
    }
  })

  User.sync(function () {
    User.create({
      id: 'admin',
      password: 'password',
      access: config.maxAccess
    }, function (err) {
      if (err) {
        if (err.code == 23505)
            return console.log('admin already exists')
        return console.error(err.message)
      }

      return console.log('admin created successfully')
    })
  })
}