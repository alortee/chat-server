var { getMessages, appendMessage, addMember, removeMember, getOnlineMembers } = require('../controllers/eventController')

var defineSocketEvents = function (io) {
  io.on('connection', (socket) => {
    console.log('[INFO] a user connected', socket.id)
    var room
    socket.on('join', (data) => {
      room = data.eventslug
      var user = {username: data.username, socketid: socket.id}

      socket.username = user.username
      socket.join(room)

      addMember(room, user).then(() => {
        getOnlineMembers(room).then((onlineMembers) => {
          io.to(room).emit('onlineMembers', onlineMembers)
        })
      })

      getMessages(room).then((previousMessages) => {
        socket.emit('previousMessages', previousMessages)
        socket.emit('message', {sender: 'server', text: 'Welcome to the app '})
        socket.to(room).emit('message', {sender: 'server', text: socket.username + ' joined the conversation'})
      }).catch((err) => console.log(err))
    })

    socket.on('newMessage', (data) => {
      io.to(room).emit('message', {sender: data.sender, text: data.text})
      appendMessage(room, data)
    })

    socket.on('disconnect', () => {
      removeMember(room, socket.id).then(() => {
        getOnlineMembers(room).then((onlineMembers) => {
          io.to(room).emit('onlineMembers', onlineMembers)
          socket.to(room).emit('message', {sender: 'server', text: socket.username + ' left the conversation'})
        })
      })
      console.log('[INFO] a user disconnected', socket.id)
    })
  })
}

var initializeSocket = function (server) {
  var socketserver = require('http').Server(server)
  var io = require('socket.io')(socketserver)

  defineSocketEvents(io)

  return socketserver
}

module.exports = initializeSocket
