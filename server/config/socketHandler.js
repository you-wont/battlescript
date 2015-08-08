var roomModel = require('../room/roomModel.js');

module.exports = function(socket){
  var joinRoom = roomModel.createOrGetRoom();
  socket.join(joinRoom);
  socket.on('textChange', function(data){
    socket.broadcast.to(joinRoom).emit('updateEnemy', data);
  });
}