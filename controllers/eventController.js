const pick = require('lodash/pick')
const TokenGenerator = require('../utils/tokenGenerator')
var { Eventmodel } = require('../models/event')

var options = {
  expiresIn: '1h',
  audience: process.env.APP_URL,
  issuer: process.env.APP_NAME
}

var tg = new TokenGenerator(options)

var createEvent = function (req, res, next) {
  var fakesluggy = req.body.name.split(' ').join('-').toLowerCase()
  var event = new Eventmodel({
    _creator: req.user._id,
    name: req.body.name,
    slug: fakesluggy
  })

  event.members.push(pick(req.user, ['username', 'role']))
  event.save().then((doc) => {
    res.send({status: 'OK'})
  }).catch((err) => {
    res.send({status: 'FAILED', error: 'an error occured'})
    console.log(err)
  })
};

var getEvents = function (req, res, next) {
  var user = req.user
  Eventmodel.find({_creator: user._id}).then((events) => {
    var mapped = events.map(function (event) {
      return {
        name: event.name,
        slug: event.slug
      }
    })
    res.send({status: 'OK', events: mapped})
  }).catch((err) => {
    console.log(err)
    res.send({status: 'FAILED', error: 'an error occured'})
  })
}

var getEventDetails = function (req, res ,next) {
  Eventmodel.findOne({slug: req.params.event}).then((event) => {
    if (!event) return res.send({status: 'FAILED', error: 'event not found'})
    res.send({status: 'OK', eventname: event.name, themeColor: event.themeColor})
  }).catch((err) => {
    console.log(err)
    res.send({status: 'FAILED', error: 'an error occured'})
  })
}

var joinEvent = function (req, res, next) {
  Eventmodel.findOne({slug: req.params.event}).then((doc) => {
    if (!doc) return res.send({status: 'FAILED', error: 'event not found'})
    var exists = doc.online.find(item => (item.username.toLowerCase() === req.body.username.toLowerCase()))
    if (exists) return res.send({status: 'FAILED', error: 'username is taken'})
    var record = {username: req.body.username, role: 'attendee'}
    doc.members.push(record)
    record.eventslug = req.params.event
    var token = tg.sign(record)
    doc.save().then(() => res.send({token, status: 'OK'})).catch((err) => console.log(err))
  })
}

var getMessages = function (eventslug) {
  return new Promise((resolve, reject) => {
    Eventmodel.findOne({slug: eventslug}).then((doc) => {
      if (!doc) reject('event not found')

      var mapped = doc.messages.map(item => {
        return {
          sender: item.sender,
          text: item.text
        }
      })
      resolve(mapped)
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}

var appendMessage = function (eventslug, message) {
  Eventmodel.findOneAndUpdate({slug: eventslug}, {$push: {messages: message}}).then((doc) => {
    console.log('added', message)
  }).catch((err) => {
    console.log(err)
  })
}

var getOnlineMembers = function (eventslug) {
  return new Promise((resolve, reject) => {
    Eventmodel.findOne({slug: eventslug}).then((doc) => {
      var mapped = doc.online.map(item => {
        return item.username
      })
      resolve(mapped)
    }).catch((err) => {
      reject(err)
      console.log(err)
    })
  })
}

var addMember = function (eventslug, user) {
  return new Promise((resolve, reject) => {
    Eventmodel.findOneAndUpdate({slug: eventslug}, {$push: {online: user}}).then((doc) => {
      console.log('added', user)
      resolve()
    }).catch((err) => {
      reject(err)
      console.log(err)
    })
  })
}

var removeMember = function (eventslug, sockid) {
  return new Promise((resolve, reject) => {
    Eventmodel.findOneAndUpdate({slug: eventslug}, {$pull: {online: {socketid: sockid}}}).then((doc) => {
      resolve()
      console.log('removed', sockid)
    }).catch((err) => {
      reject(err)
      console.log(err)
    })
  })
}

module.exports = {
  createEvent,
  getEvents,
  getEventDetails,
  joinEvent,
  appendMessage,
  getMessages,
  getOnlineMembers,
  addMember,
  removeMember
}
