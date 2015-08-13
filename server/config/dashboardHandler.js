// var roomModel = require('../room/roomModel.js');

var socketList = {};

module.exports = function(socket, io){
  socket.join('dashboard');

  var username = socket.handshake.query.username;
  socketList[username] = socket.id;

  console.log('LINE 11: ', username);
  
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

  // look for signal that a battle has been accepted
  socket.on('battleAccepted', function(users) {
    var userId = socketList[users.user];
    var opponentId = socketList[users.opponent];

    // now, need to broadcast to the opponent that it's time for battle
    socket.broadcast.to(opponentId).emit('prepareForBattle');

    // and also, broadcast back to user
    io.sockets.connected[userId].emit('prepareForBattle');
  });

  socket.on('disconnect', function(){
    console.log('SERVER TRYING TO DISCONNECT -----------> here');
    setTimeout(function() {
      updateUsers();
    }, 100);
  });
};