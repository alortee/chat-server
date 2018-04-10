var express = require('express')
var homeRouter = express.Router()

var { loginUser, registerUser, logoutUser } = require('../controllers/authController')

homeRouter.route('/login')
  .post(loginUser)

homeRouter.route('/register')
  .post(registerUser)

homeRouter.route('/logout')
  .get(logoutUser)

module.exports = { homeRouter }
