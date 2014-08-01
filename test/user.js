var assert = require('assert')

var package = require('../package')
var config = require('../config')

var client = require('restify').createJsonClient({
  url: 'http://localhost:' + config.port,
  version: package.version,
  gzip: true
})

describe('user', function () {
  
  it('should be got access after register', function (done) {
    client.post('/user', {
      id: 'test',
      password: '123456'
    }, function (err, req, res, obj) {
      if (err)
        return done(err)

      assert.equal(obj.id, 'test')
      assert.equal(obj.access, 0)
      done()
    })
  })

  it('should be get access by self', function (done) {
    client.basicAuth('test', '123456')
      .get('/user/test', function (err, req, res, obj) {
        if (err)
          return done(err)

        assert.equal(obj.access, 0)
        done()
      })
  })
  
  it('should be authorized in new password after change password', function (done) {
    client.basicAuth('test', '123456')
      .put('/user/test', {
        password: '654321'
      }, function (err, req, res, obj) {
        if (err)
          return done(err)

        client.basicAuth('test', '654321').get('/user/test', done)
      })
  })
  
  it('should not be authorized in old password after change password', function (done) {
    client.basicAuth('test', '123456').get('/user/test', function (err, req, res, obj) {
      assert.equal(err.name, 'UnauthorizedError')
      done()
    })
  })
  
  it('should be removed by admin', function (done) {
    client.basicAuth('admin', 'password').del('/user/test', done)
  })
})