const bcrypt = require('bcryptjs')
const pick = require('lodash/pick')
const TokenGenerator = require('../utils/tokenGenerator')
var { User } = require('../models/user.js')

var options = {
  expiresIn: '1h',
  audience: [process.env.APP_URL],
  issuer: process.env.APP_NAME
}

var tg = new TokenGenerator(options)

var loginUser = function (req, res, next) {
  var credentials = pick(req.body, ['username', 'password'])

  User.findOne({username: credentials.username}).then((user) => {
    if (!user) return res.send({status: 'FAILED', error: 'invalid credentials'})

    var match = bcrypt.compareSync(credentials.password, user.password)

    if (!match) return res.send({status: 'FAILED', error: 'invalid credentials'})

    var payload = pick(user, ['username', 'role'])
    var token = tg.sign(payload)
    res.send({token, status: 'OK'})
  }).catch((err) => {
    res.send({status: 'FAILED', error: 'an error occured'})
  })
}

var registerUser = function (req, res, next) {

  User.findOne({username: req.body.username}).then((user) => {
    if (user) return res.send({status: 'FAILED', error: 'username is taken'})

    var hash = bcrypt.hashSync(req.body.password, 10)

    var user = new User({
      username: req.body.username,
      password: hash
    })

    user.save().then((user) => {
      var payload = pick(user, ['username', 'role'])
      var token = tg.sign(payload)
      res.send({token, status: 'OK' })
    }).catch((err) => {
      console.log(err)
      res.send({status: 'FAILED', error: 'an error occured'})
    })
  }).catch((err) => {
    res.send({status: 'FAILED', error: 'an error occured'})
  })
}

var logoutUser = function (req, res, next) {
  res.send({status: 'OK'})
}

module.exports = { loginUser, registerUser, logoutUser }
