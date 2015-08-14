angular.module('battlescript.dashboard', [])

.controller('DashboardController', function ($scope, $rootScope, $timeout, Dashboard, Users, Battle) {
  // get current auth username
  $scope.username = Users.getAuthUser();

  // this gets passed into the directive.
  // it definitely needs to be refactored depending on what happens
  // up above.
  $scope.userInfo = {username: $scope.username};

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

  // 
  $scope.battleRoomHash;

  ////////////////////////////////////////////////////////////
  // set up online users
  ////////////////////////////////////////////////////////////

  $scope.onlineUsers;


  $rootScope.dashboardSocket.on('updateUsers', function(data) {
    //TODO: Online users.

    console.log('NEED TO UPDATE USERS CUZ OF SOME EVENT');
    console.log(data);

    if (data[$scope.username]) {
      delete data[$scope.username];
    }

    $scope.onlineUsers = data;
    $scope.$apply();

  });

  ////////////////////////////////////////////////////////////
  // handle battle requests
  ////////////////////////////////////////////////////////////

  // Open up socket with specific dashboard server handler
  $scope.requestBattle = function($event, opponentUsername) {
    $event.preventDefault();

    // now, we need to emit to the socket
    $rootScope.dashboardSocket.emit('outgoingBattleRequest', {
      fromUser: $scope.username,  // request from the logged in user
      toUser: opponentUsername    // request to the potential opponent
    });
  };

  // listen for incoming battle request
  $rootScope.dashboardSocket.on('incomingBattleRequest', function(user){
    $scope.battleRequestOpponentName = user.fromUser;
    $scope.userHasBattleRequest = true;
    $scope.battleRequestStatus = 'open';
    $scope.$apply();
    console.log("opponent has challenged you: ", user.fromUser);
  });

  // battle has been accepted
  $scope.battleAccepted = function() {
    // need to somehow notify challenger that the battle has been accepted
    $rootScope.dashboardSocket.emit('battleAccepted', {
      user: $scope.username,                      // the user who accepted the battle
      opponent: $scope.battleRequestOpponentName  // the opponent needs to be notified
    });
  };

  // battle has been declined
  $scope.battleDeclined = function() {
    // TODO: make it work.
  };

  // prepare for battle, only gets fired when a user has sent a battle request,
  // and another user has accepted.
  $rootScope.dashboardSocket.on('prepareForBattle', function(data) {
    // at this point, the opponent (i.e. the person who sent the initial battle
    // request) should be notified that the person he/she challenged has
    // accepted.
    console.log('prepare for battle!', data);

    $scope.battleRoomHash = data.roomhash;

    // a notification should pop up on both screens
    $scope.userHasBattleRequest = true;
    $scope.battleRequestStatus = 'init';
    $scope.$apply();
    
    // the url hash needs to also be sent to the player who accepted the
    // challenge
  });
  
});