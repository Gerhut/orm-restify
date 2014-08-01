module.exports = require('lodash')
  .once(function (db) {
    require('./models')(db)
    return require('./handles')
  })
