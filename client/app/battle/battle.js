angular.module('battlescript.battle', [])

.controller('BattleController', function($scope, Battle){
  $scope.battle;
  $scope.battleDescription = null;
  $scope.battleProjectId = null;
  $scope.battleSolutionId = null;

  // fetch a battle
  $scope.getBattle = function() {
    console.log('getting');
    Battle.getBattle()
      .then(function(data) {
        $scope.battle = JSON.parse(data.body);
        $scope.battleDescription = $scope.battle.description;

        $scope.battleProjectId = $scope.battle.session.projectId;
        $scope.battleSolutionId = $scope.battle.session.solutionId;
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  // var socket = io.connect('http://localhost:8000');
  var socket = io.connect('http://localhost:8000');

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

  // What this does is when someone goes on a different page, it disconnects the "user"
  // So, it emits the event disconnect user
  $scope.$on('$routeChangeStart', function(event, next, current) {
    console.log('routeChangeStart');
    socket.emit('disconnectedClient');
  });

  // This does the same, for refresh. Now go to socket handler for more info
  window.onbeforeunload = function(e) {
    socket.emit('disconnectedClient');
  };


});