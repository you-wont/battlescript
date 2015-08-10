var rooms = {};
var count = 0;
var totalInRoom = 2;

var roomSet = function(){
  var roomInstance = {};

  roomInstance.members = 0;
  roomInstance.maxLen = totalInRoom;
  roomInstance.count = count;


  roomInstance.needsMember = function(){
    if (this.members < this.maxLen) {
      return true;
    } else {
      return false;
    }
  }

  return roomInstance;
}

var createRoom = function(){
  var newRoom = new roomSet();
  save(newRoom);
  count++;
  return newRoom;
}


var save = function(room){
  rooms[room.count] = room;
};

var getOpenRoom = function(){
  for (var key in rooms) {
    if (rooms[key].needsMember()){
      return rooms[key];
    }
  }

  return null;
}

var removeRoom = function(key){
  delete rooms[key];
}

var createOrGetRoom = function(){
  if(getOpenRoom()){
    var returnVal = getOpenRoom();
    returnVal.members++;
    return returnVal;
  } else {
    var returnVal = createRoom();
    returnVal.members++;
    return returnVal;
  }
}



module.exports.createOrGetRoom = createOrGetRoom;
module.exports.save = save;
module.exports.removeRoom = removeRoom;


