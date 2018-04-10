const dotenv = require('dotenv').config()
const express = require('express')
const path = require('path')

var { mongoose } = require('./mongoose')
var { homeRouter } = require('./routes/homeRouter')
var { userRouter } = require('./routes/userRouter')
var { eventRouter } = require('./routes/eventRouter')

var server = express()
var port = process.env.PORT || 3000;

server.disable('x-powered-by')

if (process.env.APP_ENV === 'development')
  server.use(require('cors')({origin: 'http://localhost:8080'})) // for development purpose

server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use(express.static(path.join(__dirname, 'client')))

server.use('/', homeRouter)
server.use('/u', userRouter)
server.use('/event', eventRouter)

var socketserver = require('./socket')(server)

socketserver.listen(port, () => {
  console.log('[INFO] server bound to port %s', port)
})
