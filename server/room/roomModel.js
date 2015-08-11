var rooms = {};
var roomCount = 0;
var totalInRoom = 2;

var Room = function(){
  var roomInstance = {};

  roomInstance.members = 0;
  roomInstance.maxOccupancy = totalInRoom;
  roomInstance.roomID = roomCount;


  roomInstance.needsMember = function(){
    if (this.members < this.maxOccupancy) {
      return true;
    } else {
      return false;
    }
  }

  return roomInstance;
}

var createRoom = function(){
  var newRoom = Room();
  updateRooms(newRoom);
  roomCount++;
  return newRoom;
}


var updateRooms = function(room){
  rooms[room.roomID] = room;
};

var getOpenRoom = function(){
  for (var id in rooms) {
    if (rooms[id].needsMember()){
      return rooms[id];
    }
  }

  return null;
}

var removeRoom = function(id){
  delete rooms[id];
}

var createOrGetRoom = function(){
  var openRoom = getOpenRoom();
  if(!openRoom){ // returns null if there are no open rooms
    var openRoom = createRoom();
  }
  openRoom.members++;
  return openRoom;
}



module.exports.createOrGetRoom = createOrGetRoom;
module.exports.updateRooms = updateRooms;
module.exports.removeRoom = removeRoom;
module.exports.rooms = rooms;
module.exports.roomCount = roomCount;


