var roomModel = require('../room/roomModel.js');

module.exports = function(socket){
  var username = socket.handshake.query.username;
  console.log('connected');
  var joinedRoom = roomModel.createOrGetRoom();
  joinedRoom.users.push(username);
  console.log("CURRENT STATE OF ROOMS: ", roomModel.rooms);
  console.log("I JUST JOINED :", joinedRoom);
  console.log("Joined room ID :", joinedRoom.id);
  console.log("Total number of rooms: ", roomModel.roomCount);
  // Join a room
  socket.join(joinedRoom.id);
  // Increment members
  // joinedRoom.members++;

  // Save the room. Save it with the count (its like a key)
  roomModel.updateRooms(joinedRoom);


  socket.on('textChange', function(data){
    socket.broadcast.to(joinedRoom.id).emit('updateEnemy', data);
  });

  // I catch the disconnected client. What I do is 'remove' the memeber from the room
  // I also delete it if there are no people in the room
  // and save it if ppl remain.

  // The magic in this method is that the client is never really "disconnected..."
  // He's just moving from room to room. Or no room at all...

  socket.on('disconnectedClient', function(){
    console.log('disconnectedClient');
    console.log('DISCONECTED FROM ROOM: ', joinedRoom.id);

    joinedRoom.members--;

    if (joinedRoom.members === 0) {
      roomModel.removeRoom(joinedRoom.id);
    } else {
      roomModel.updateRooms(joinedRoom.id);
    }

  });
};