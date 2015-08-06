var IO = require('socket.io');

module.exports = function(server, namespace) {

  if (!namespace) {
    namespace = "/";
  }

  var newIOServer = IO(server);

  return {

    server: newIOServer,
    socket: null,
    rooms: {length: 0},
    currentRoom: "",
    send: function(event, obj, roomname){
      if (roomname) {
        if (Array.isArray(roomname)){
          for (var i = 0; i < roomname.length; i++) {
            this.sendAll(event, obj, roomname[i]);
          }
        } else if (typeof roomname === "string") {
          this.socket.to(roomname).emit(event, obj);
        }
      } else {
        console.log('emitting');
        this.socket.emit(event, obj);
      }
    },

    listenTo: function(event, func, room){
      if (event.split(" ").length > 1) {
        console.log("Event args must have no spaces")
      }

      if (room) {
        event += " to " + this.currentRoom; 
      }

      this.socket.on(event, func);
    },

    removeRoom: function(roomName) {

      if (rooms[roomName]){
        delete rooms[roomName];
        rooms.length--;
      }

    }, 

    // Add a room to our hash
    addRoom: function(roomname){

      if (roomname === "length") {
        console.log("Invalid Roomname");
        return;
      }

      if (!this.rooms[roomname]){
        this.rooms.length++;
        this.rooms[roomname] = true;
      } else {
        console.log("Room taken... Ignoring");
      }
    },

    // Delete a room in our hash.
    deleteRoom: function(roomname){
      if (this.rooms[roomname]){
        delete this.rooms[roomname];
        this.ioConnection.leave(roomname);
      }
    },

    setRoom: function(roomname){
      this.currentRoom = roomname;
    },

    iterateRooms: function(cb){
      for (var key in roomname) {
        if (key != length) {
          cb(roomname[key]);
        }
      }
    },

    onConnect: function(cb) {
      var that = this;
      this.server.on('connection', function(socket){
        that.socket = socket;
        cb(that);
      });
    }

  }
}

