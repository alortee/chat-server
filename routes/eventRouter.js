const path = require('path')
var express = require('express')
var eventRouter = express.Router()

var { getEventDetails, joinEvent } = require('../controllers/eventController')
var { checkToken } = require('../middleware/checkToken')

eventRouter.route('/:event')
  .get(getEventDetails)
  .post(joinEvent)

eventRouter.route('/:event/check_token')
  .post(checkToken)

module.exports = { eventRouter }
