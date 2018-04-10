const jwt = require('jsonwebtoken')

module.exports = TokenGenerator = function (options) {
  if (options && typeof options !== 'object')
    throw new Error('expects object as argument')
  this.options = options
  this.secret = process.env.APP_KEY
}

TokenGenerator.prototype.sign = function (payload, signOptions) {
  var jwtSignOptions = Object.assign({}, signOptions, this.options)
  return jwt.sign(payload, this.secret, jwtSignOptions)
}

TokenGenerator.prototype.verify = function (payload) {
  return jwt.verify(payload, this.secret)
}
