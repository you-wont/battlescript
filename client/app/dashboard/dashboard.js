angular.module('battlescript.dashboard', [])

.controller('DashboardController', function ($scope, $timeout, Dashboard) {
  $scope.username = window.localStorage.getItem('username');

  ////////////////////////////////////////////////////////////
  // set up sockets here
  ////////////////////////////////////////////////////////////
  var socket = io('http://localhost:8000', {
    query: 'username=' + $scope.username + '&handler=dashboard'
  });


  ////////////////////////////////////////////////////////////
  // set up users
  ////////////////////////////////////////////////////////////

  $scope.onlineUsers;

  $scope.getOnlineUsers = function(){
    Dashboard.getOnlineUsers()
      .then(function(data) {
        $scope.onlineUsers = data;
        // $timeout(function() {
        //   $scope.getOnlineUsers();
        // }, 1000);
      });
  };
  $scope.getOnlineUsers();

  // Open up socket with specific dashboard server handler
  $scope.requestBattle = function($event, opponentUsername) {
    $event.preventDefault();

    // now, we need to emit to the socket
    socket.emit('battleRequest', {
      fromUser: $scope.username,
      toUser: opponentUsername
    });
  };


});