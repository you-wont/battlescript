angular.module('battlescript.dashboard', [])

.controller('DashboardController', function ($scope, $timeout, Dashboard) {
  $scope.username = window.localStorage.getItem('username');

  ////////////////////////////////////////////////////////////
  // set up sockets here
  ////////////////////////////////////////////////////////////
  var socket = io('http://localhost:8000', {
    query: 'username=' + $scope.username + '&handler=dashboard'
  });

  $scope.$on('$routeChangeStart', $scope.logout);

  // This does the same, for refresh. Now go to socket handler for more info
  window.onbeforeunload = function(e) {
    $scope.logout();
  };
  
  // Logout on back button
  window.addEventListener("hashchange", $scope.logout)

  $scope.logout = function(){
    socket.emit('userLoggedOut');
  };

  ////////////////////////////////////////////////////////////
  // set up users
  ////////////////////////////////////////////////////////////

  $scope.onlineUsers;

  $scope.getOnlineUsers = function(){
    Dashboard.getOnlineUsers()
      .then(function(data) {
        $scope.onlineUsers = data;
      });
  };

  $scope.getOnlineUsers();

  socket.on('updateUsers', function() {
    console.log('UPDATING USERS');
    $scope.getOnlineUsers();
  });

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