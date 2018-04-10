const mongoose = require('mongoose')

var Schema = mongoose.Schema

var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin'
  }
})

var User = mongoose.model('User', userSchema)

module.exports = { User }
