// var roomModel = require('../room/roomModel.js');

module.exports = function(socket, io){
  socket.join('dashboard');

  var username = socket.handshake.query.username;
  console.log(username, ' connected to dashboard!');
  
  // send signal that user has connected to dashboard
  var updateUsers = function(){
    socket.in('dashboard').emit('updateUsers');
  }

  // Update Users when first connected
  updateUsers();
  // socket.emit('userJoinedDashboard');
  
  // look for signal that someone wants to battle
  socket.on('battleRequest', function(users){
    console.log('battle requested by: ', users.fromUser, ' to: ', users.toUser);
  });

  socket.on('userLoggedOut', function(){
    console.log("USER HAS LOGGED OUT");
    updateUsers();
  });
};