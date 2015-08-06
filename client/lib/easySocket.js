// Create an easy io obj.... For obj decleration
var easyio = {
  // Returns an io connection (provided by socket io) and attaches helpers
  connect: function(url){

    if (url.split(':').length <= 2 ) {
      url += ":" + window.location.port;
      console.log('appended');
      console.log(url);
    }

    return {
      ioConnection: io.connect(url),  //Socket io creates this io obj... We are using it.

      // These helpers fallback to socket io. For now
      listenTo: function(event, func){
        // Create a more intuitive way of using rooms. Store and sync them...
        // Ensure that the listenTo event JUST GETS one arg
        if (event.split(" ").length > 1) {
          console.log("Event args must have no spaces")
        }

        this.ioConnection.on(event, func);
      },

      // Delegate trigger to socket.io, but allow multiple args.
      trigger: function(event, data) {
        if (Array.isArray(event)){
          for (var i = 0; i < event; i++){
            this.trigger(event[i]);
          }
        } else {
          console.log(event);
          this.ioConnection.emit(event, data);
        }
        
      }
    }
  }
}