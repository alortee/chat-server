const mongoose = require('mongoose')

var Schema = mongoose.Schema

var eventSchema = new Schema({
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  themeColor: {
    type: String,
    default: 'default'
  },
  members: [
    {
      username: {
        type: String,
        required: true
      },
      role: {
        type: String,
        required: true,
        enum: ['attendee', 'support', 'admin'],
        default: 'attendee'
      }
    }
  ],
  messages: [
    {
      sender: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      created_at: {
        type: String,
        required: true,
        default: new Date()
      }
    }
  ],
  online: [
    {
      username: String,
      socketid: String
    }
  ]
})

var Eventmodel = mongoose.model('Event', eventSchema)

module.exports = { Eventmodel }
