angular.module('battlescript.dashboard', [])

.controller('DashboardController', function ($scope, $timeout, Dashboard, Users) {
  // scope.username always refers to the curreng logged in user
  // 
  // TODO: extract this into the global set up, so we don't have to keep
  // rededfining it in every controller
  $scope.username = window.localStorage.getItem('username');

  // this gets passed into the directive.
  // it definitely needs to be refactored depending on what happens
  // up above.
  $scope.userInfo = {
    username: $scope.username
  };

  ////////////////////////////////////////////////////////////
  // sets up all the dashboard stuff here
  ////////////////////////////////////////////////////////////

  // this defaults to false, because when the page first loads, there is 
  // no battle request for the logged in user
  $scope.userHasBattleRequest = false;

  // battle request status can be 'none', 'open', or 'init'. it defaults
  // to none, changes to open when a request is first sent, and changes to
  // init if the user accepts/declines the battle request.
  $scope.battleRequestStatus = 'none';

  // this defaults to null, because by default, no opponents have challenged
  // the logged in user
  $scope.battleRequestOpponentName = null;

  ////////////////////////////////////////////////////////////
  // set up sockets
  ////////////////////////////////////////////////////////////

  // initial dash socket connection
  // $scope.dashboardSocket = Sockets.createSocket('dashboard');
  
  // $scope.dashboardSocket.on('connect', function() {
  //   console.log('dashboard socket connected');

  //   // if ($scope.dashboardSocket && $scope.dashboardSocket.id === undefined) {
  //   //   console.log($scope.dashboardSocket);
  //   //   console.log('?');
  //   // }

  //   $scope.handleDashboardSocketEvents();
  // });

  // $scope.dashboardSocket.on('reconnect', function() {
  //   console.log('?????????????');
  // });

  // $scope.handleDashboardSocketEvents = function() {
  //   console.log('dash sock evts');

  //   $scope.$on('$stateChangeStart', function() {
  //     console.log('state changed, about to disconn socket');
  //     $scope.dashboardSocket.disconnect();
  //   });
  // };

  // var dashboardSocket = io.connect('http://localhost:8000/#/dashboard');
  // dashboardSocket.on('connect', function() {
  //   dashboardSocket.emit('hi!');
  // });

  // TODO: extract these out into a Socket factory for simple reuse

  // var socket = Sockets.createSocket(['username=nick', 'handler=dashboard']);

  // $scope.$on('$routeChangeStart', $scope.logout);

  // // This does the same, for refresh. Now go to socket handler for more info
  // window.onbeforeunload = function(e) {
  //   $scope.logout();
  // };
  
  // // Logout on back button
  // window.addEventListener("hashchange", $scope.logout)

  // $scope.logout = function(){
  //   socket.emit('userLoggedOut');
  // };

  ////////////////////////////////////////////////////////////
  // set up online users
  ////////////////////////////////////////////////////////////

  $scope.onlineUsers;

  $scope.getOnlineUsers = function(){
    Users.getOnlineUsers()
      .then(function(data) {
        console.log(data);
        $scope.onlineUsers = data;
      });
  };

  $scope.getOnlineUsers();

  // socket.on('updateUsers', function() {
  //   $scope.getOnlineUsers();
  // });

  ////////////////////////////////////////////////////////////
  // handle battle requests
  ////////////////////////////////////////////////////////////

  // Open up socket with specific dashboard server handler
  $scope.requestBattle = function($event, opponentUsername) {
    $event.preventDefault();

    // now, we need to emit to the socket
    socket.emit('outgoingBattleRequest', {
      fromUser: $scope.username,  // request from the logged in user
      toUser: opponentUsername    // request to the potential opponent
    });
  };

  // listen for incoming battle request
  // socket.on('incomingBattleRequest', function(user){
  //   $scope.battleRequestOpponentName = user.fromUser;
  //   $scope.userHasBattleRequest = true;
  //   $scope.battleRequestStatus = 'open';
  //   $scope.$apply();
  //   console.log("opponent has challenged you: ", user.fromUser);
  // });

  // battle has been accepted
  $scope.battleAccepted = function() {
    // need to somehow notify challenger that the battle has been accepted
    socket.emit('battleAccepted', {
      opponent: $scope.battleRequestOpponentName  // the opponent needs to be notified
    });
  };

  // battle has been declined
  $scope.battleDeclined = function() {

  };

  // prepare for battle, only gets fired when a user has sent a battle request,
  // and another user has accepted.
  // socket.on('prepareForBattle', function() {
  //   // at this point, the opponent (i.e. the person who sent the initial battle
  //   // request) should be notified that the person he/she challenged has
  //   // accepted.
  //   console.log('prepare for battle');

  //   // on this notification, the url hash needs to be generated and sent to the
  //   // opponent.
    
    
  //   // the url hash needs to also be sent to the player who accepted the
  //   // challenge
  // });
  
});