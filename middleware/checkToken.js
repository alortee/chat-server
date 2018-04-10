var { User } = require('../models/user.js')
var { Eventmodel } = require('../models/event.js')
const TokenGenerator = require('../utils/tokenGenerator')
var tg = new TokenGenerator()

var checkToken = function (req, res, next) {
  var token = req.header('Authorization').split('Bearer ')[1]

  try {
    var decoded = tg.verify(token)
  } catch (err) {
    console.log(err)
    return res.status(401).send()
  }

  if (decoded.role === 'admin') {
    User.findOne({username: decoded.username}).then((user) =>{
      return Eventmodel.findOne({slug: req.body.eventslug, _creator: user.id})
    }).then((doc) => {
      if (doc) return res.send({status: 'OK'})
      Promise.reject()
    }).catch((err) => {
      return res.status(401).send()
    })
  } else  {
    if (req.body.eventslug === decoded.eventslug) return res.send({status: 'OK'})
    return res.status(401).send()
  }

}

module.exports = { checkToken }
