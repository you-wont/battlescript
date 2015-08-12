// var roomModel = require('../room/roomModel.js');

module.exports = function(socket, io){
  var username = socket.handshake.query.username;
  console.log(username, ' connected to dashboard!');
  
  // send signal that user has connected to dashboard
  socket.emit('userJoinedDashboard', username);
  
  // look for signal that someone wants to battle
  socket.on('battleRequest', function(users){
    console.log('battle requested by: ', users.fromUser, ' to: ', users.toUser);
  });
};