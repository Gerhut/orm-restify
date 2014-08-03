angular.module('ormRestify.user')
  .service('user',
  ['$http', '$resource',
  function ($http, $resource) {

    var _id = null
    var _access = null

    var resource = $resource('http://localhost:8080/user/:id', null, {
      change: { method:'PUT' }
    })

    this.getId = function () { return _id }
    this.getAccess = function () { return _access }

    this.register = function (id, password, callback) {
      resource.save(null, {
        id: id,
        password: password
      }, function (value, headers) {
        callback()
      }, function (response) {
        callback(response.data.message)
      })
    }

    this.login = function (id, password, callback) {
      $http.defaults.headers.common.Authorization = 'Basic ' + btoa(id + ':' + password)

      resource.get({
        id: id
      }, function (value) {
        _id = id
        _access = value.access
        callback(null, value.access)
      }, function (response) {
        callback(response.data.message)
      })
    }

    this.logout = function () {
      delete $http.defaults.headers.common.Authorization
      _id = _access = null
    }

    this.changePassword = function (oldPassword, newPassword, callback) {
      $http.defaults.headers.put.Authorization = 'Basic ' + btoa(_id + ':' + oldPassword)
      resource.change({
        id: _id
      }, {
        password: newPassword
      }, function () {
        callback()
      }, function (response) {
        callback(response.data.message)
      })
      delete $http.defaults.headers.put.Authorization
    }
  }])