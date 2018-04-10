var { User } = require('../models/user.js')
const TokenGenerator = require('../utils/tokenGenerator')
var tg = new TokenGenerator()

var verifyAuth = function (req, res, next) {
  var token = req.header('Authorization').split('Bearer ')[1]

  try {
    var decoded = tg.verify(token)
  } catch (err) {
    console.log(err)
    return res.status(401).send()
  }

  User.findOne({username: decoded.username}).then((user) =>{
    if (!user) return res.status(401).send()
    req.user = user
    next()
  }).catch((err) => {
    return res.status(401).send()
  })
}

module.exports = { verifyAuth }
