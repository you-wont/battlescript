// var roomModel = require('../room/roomModel.js');

var socketList = {};

module.exports = function(socket, io){
  socket.join('dashboard');

  var username = socket.handshake.query.username;
  socketList[username] = socket.id;
  
  // send signal that user has connected to dashboard
  var updateUsers = function(){
    socket.in('dashboard').emit('updateUsers');
  }

  // Update Users when first connected
  updateUsers();
  
  // look for signal that someone wants to battle
  socket.on('outgoingBattleRequest', function(users){
    var oppId = socketList[users.toUser];

    socket.broadcast.to(oppId).emit('incomingBattleRequest', {
      fromUser: users.fromUser
    });
  });

  socket.on('userLoggedOut', function(){
    updateUsers();
  });
};