angular.module('ormRestify.config', [])
.value('remote', (
  (location.host.indexOf('github') > -1)
  ? 'http://orm-restify.herokuapp.com'
  : 'http://localhost:8080'
))