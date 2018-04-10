var express = require('express')
var userRouter = express.Router()
var { verifyAuth } = require('../middleware/authenticate.js')

var { createEvent, getEvents } = require('../controllers/eventController')

userRouter.route('/events/get')
  .get(verifyAuth, getEvents)

userRouter.route('/events/create')
  .post(verifyAuth, createEvent)

module.exports = { userRouter }
