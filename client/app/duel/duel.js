angular.module('battlescript.duel', [])

.controller('DuelController', function($scope){
  $scope.challenge = "FETCH FROM API";

  // var socket = io.connect('http://localhost:8000');
  var socket = io.connect('http://localhost:8000', {'force new connection': true});
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });


  // Initializes the editors
  var editor1 = ace.edit("editor1");
  editor1.setTheme("ace/theme/monokai");
  editor1.getSession().setMode("ace/mode/javascript");

  var editor2 = ace.edit("editor2");
  editor2.setTheme("ace/theme/monokai");
  editor2.getSession().setMode("ace/mode/javascript");
  editor2.setReadOnly(true);

  editor1.getSession().on('change', function(e) {
    console.log(editor1.getValue());
    socket.emit('textChange', editor1.getValue());
  });

  socket.on('updateEnemy', function(text){
    editor2.setValue(text);
    editor2.clearSelection();
  });

  // location change listeners
  $scope.$on('$routeChangeStart', function(event, next, current) {
    console.log('kill socket');
  });

  // handle refresh event
  window.onbeforeunload = function(e) {
    console.log('unload');
  };

});