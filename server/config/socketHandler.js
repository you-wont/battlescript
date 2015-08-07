module.exports = function(socket){

  socket.on('textChange', function(data){
    socket.broadcast.emit('updateEnemy', data);
  });

}