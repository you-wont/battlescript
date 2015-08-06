
module.exports = function(socket){
  console.log('server ready')
  socket.send('news', {hello: "world"});

  socket.listenTo('textChange', function(){
    console.log('TEXT CHANGEEEEE');
  });
}
