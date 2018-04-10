const mongoose = require('mongoose')

var db = mongoose.connection

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI)

db.once('open', () => {
  console.log('[INFO] connected to mongodb')
})

db.on('error', (err) => {
  console.log('[WARN] %s', err.message)
})

module.exports = { mongoose }
