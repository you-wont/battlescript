var roomModel = require('../room/roomModel.js');

module.exports = function(socket){
  var joinedRoom = roomModel.createOrGetRoom();
  socket.join(joinedRoom);
  socket.on('textChange', function(data){
    socket.broadcast.to(joinedRoom).emit('updateEnemy', data);
  });

  socket.on('disconnect', function(){
    joinedRoom.members--;
    console.log('Client left room...');
    if (joinedRoom.members === 0) {
      roomModel.removeRoom(joinedRoom);
      console.log('deleting room');
    }
  });
};