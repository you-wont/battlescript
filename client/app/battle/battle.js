angular.module('battlescript.battle', [])

.controller('BattleController', function($rootScope, $scope, $timeout, $location, $stateParams,$interval, Users, Battle, Editor) {

  ////////////////////////////////////////////////////////////
  // fetch auth user and pass in info to directive
  ////////////////////////////////////////////////////////////

  $scope.user = Users.getAuthUser();
  $scope.userInfo = {username: $scope.user};





  ////////////////////////////////////////////////////////////
  // set up spinner class and display it by default
  ////////////////////////////////////////////////////////////

  $scope.spinnerOn = true;





  ////////////////////////////////////////////////////////////
  // check first to see if valid battle room id
  ////////////////////////////////////////////////////////////

  $scope.battleRoomId = $stateParams.id;
  $scope.battleInitialized = false;

  Battle.isValidBattleRoom($scope.battleRoomId)
  .then(function(valid) {
    if (valid) {
      // if we have a valid battle room, then do this
      $rootScope.initBattleSocket($scope.battleRoomId, function() {
        // initialize battle socket events
        $scope.initBattle();
      });
    } else {
      // redirect to dashboard if battle id not valid
      $location.path('/dashboard');
    }
  })
  .catch(function(err) {
    console.log(err);
  });





  ////////////////////////////////////////////////////////////
  // set up user and opponent defaults
  ////////////////////////////////////////////////////////////

  // set up user states
  $scope.userReadyState = false;
  $scope.userReadyClass = '';
  $scope.userReadyText = 'Waiting on you';

  // set up opponent states
  $scope.opponentReadyState = false;
  $scope.opponentReadyClass = '';
  $scope.opponentReadyText = 'Waiting on opponent';





  ////////////////////////////////////////////////////////////
  // initialize the battle
  // 
  // this, importantly, needs to be set up here after the
  // battle socket itself has been initialized and set up
  // above.
  // 
  // unlike the updateUserReadyState function, this works
  // in tandem with the sockets. Hence, it needs to wait for
  // the socket to be initialized in the first place.
  ////////////////////////////////////////////////////////////

  $scope.initBattle = function() {
    // calls the function immediately, in case of refresh
    $scope.ifBothPlayersReady();

    // now listen for events
    $rootScope.battleSocket.on('opponentReady', function(opponent) {
      if ($scope.opponentReadyState === false) {
        $scope.opponentReadyState = true;
        $scope.opponentReadyClass = 'active';
        $scope.opponentReadyText = 'Ready for battle!';
        $scope.opponent = opponent;
        $scope.ifBothPlayersReady();
      } else {
        $scope.opponent = opponent;
      }
    });

    $rootScope.battleSocket.on('nameReq', function(){
      $rootScope.battleSocket.emit('nameSend', $scope.user);
    });
  };





  ////////////////////////////////////////////////////////////
  // this updates the user's ready state depending on whether
  // they clicks the button
  ////////////////////////////////////////////////////////////

  $scope.updateUserReadyState = function() {
    if ($scope.userReadyState === false) {
      $scope.userReadyState = true;
      $scope.userReadyClass = 'active';
      $scope.userReadyText = 'Ready for battle!';
      $rootScope.battleSocket.emit('userReady', $scope.user);
      $scope.ifBothPlayersReady();
    }
  };




  ////////////////////////////////////////////////////////////
  // checks if both players ready
  // 
  // this gets called each time a user clicks a "ready state"
  // button.
  ////////////////////////////////////////////////////////////
  
  $scope.ifBothPlayersReady = function() {
    if ($scope.userReadyState && $scope.opponentReadyState || window.localStorage.getItem('battleInitiated-' + $scope.battleRoomId)) {

      // If battle has already been initiated, set user and opponent ready state to true
      // so that waiting screen will not show
      if (window.localStorage.getItem('battleInitiated-' + $scope.battleRoomId)){
        $scope.userReadyState = true;
        $scope.opponentReadyState = true;
        $rootScope.battleSocket.emit('getOpponent');
      } else {
        // Save battle initiated to local storage: this will allow battle to reload automatically
        // if user refreshes page, or comes back to battle after leaving accidentally
        window.localStorage.setItem('battleInitiated-' + $scope.battleRoomId, true);
      }
      
      $scope.setUpBattle();
    } else {
      // show the battle waiting area
      $scope.spinnerOn = false;
      $scope.showBattleWaitingArea = true;
      if (!$scope.$$phase) $scope.$apply();
    }
  };
  




  ////////////////////////////////////////////////////////////
  // set up the battle here
  ////////////////////////////////////////////////////////////

  $scope.setUpBattle = function() {
    $scope.spinnerOn = true;
    if (!$scope.$$phase) $scope.$apply();
    
    // set up both editors
    $scope.userEditor = Editor.makeEditor('#editor--user', true);
    $scope.opponentEditor = Editor.makeEditor('#editor--opponent', true);
    $scope.handleEditorEvents();

    // set up various fields
    $scope.userButtonAttempt = 'Attempt Solution';
    $scope.userNotes = 'Nothing to show yet...';

    // Timeout to enable the editor and attempt solution button
    $timeout(function () {
      $scope.someSeconds = true;
      $scope.userEditor.options.readOnly = false;
    }, 8000);

    // Added timer to display while editor is in freeze
    $scope.counter = 9;
    $scope.onTimeout = function () {
      if ($scope.counter <= 1) {
        var myEl = angular.element(document.querySelector('#countdown'));
        myEl.remove();
        $interval.cancel(mytimeout);
      } else {
        $scope.counter--;
        console.log("timer to start the battle : ",$scope.counter);
      }
    };
    var mytimeout = $interval($scope.onTimeout, 1000);
    $scope.onTimeout();

    // get the battle
    $scope.getBattle();
    $scope.askPermission();
  };





  ////////////////////////////////////////////////////////////
  // handle editor events
  ////////////////////////////////////////////////////////////

  $scope.handleEditorEvents = function() {
    $scope.userEditor.on('change', function(e) {
      $rootScope.battleSocket.emit('userTextChange', $scope.userEditor.getValue());
    });

    $rootScope.battleSocket.on('updateOpponent', function(text){
      $scope.opponentEditor.setValue(text);
    });
  };





  ////////////////////////////////////////////////////////////
  // get the battle, get ready for showdown!
  ////////////////////////////////////////////////////////////
  
  $scope.getBattle = function() {
    // first, cache some vars
    $scope.battle;
    $scope.battleDescription = null;
    $scope.battleProjectId = null;
    $scope.battleSolutionId = null;

    // fetch a battle
    Battle.getBattle($scope.battleRoomId)
    .then(function(data) {
      // display the battle field
      $scope.displayBattleField();

      // set up the battle specifics
      $scope.battle = JSON.parse(data.body);
      $scope.battleDescription = marked($scope.battle.description);
      $scope.battleProjectId = $scope.battle.session.projectId;
      $scope.battleSolutionId = $scope.battle.session.solutionId;

      // update editors
      $timeout(function() {
        $scope.userEditor.setValue($scope.battle.session.setup);
        $scope.opponentEditor.setValue($scope.battle.session.setup);
        $scope.$apply();
      }, 50);

    })
    .catch(function(err) {
      console.log('There was an error fetching the problem...');
      console.log(err);
    });
  };





  ////////////////////////////////////////////////////////////
  // display the battle field
  ////////////////////////////////////////////////////////////

  $scope.displayBattleField = function() {
    // hide the spinner, hide the waiting area, and show the battle field
    $scope.spinnerOn = false;
    $scope.showBattleWaitingArea = false;
    $scope.battleFieldClass = 'active';

    // handle battle field events
    $scope.handleBattleFieldEvents();
  };





  ////////////////////////////////////////////////////////////
  // handle battle events
  ////////////////////////////////////////////////////////////

  $scope.handleBattleFieldEvents = function() {
    $rootScope.battleSocket.on('opponentWon', function(){
      // Any negative is regarded as a loss. 
      Users.statChange($scope.user, -1);

      // alert to the user!
      alert('Looks like your opponent got the answer first!');

      //redirect back. winner found
      $location.path('/dashboard'); 
    });
  };
  




  ////////////////////////////////////////////////////////////
  // handle battle attempts
  ////////////////////////////////////////////////////////////

  $scope.attemptBattle = function($event) {
    $event.preventDefault();

    $scope.userButtonAttempt = 'Attempting...';

    Battle.attemptBattle($scope.battleProjectId, $scope.battleSolutionId, $scope.userEditor.getValue())
      .then(function(data) {
        $scope.userButtonAttempt = 'Attempt Solution';
        $scope.userNotes = data.reason;

        // TODO: polling is successful at this point in time, time to send
        // and recieve the correct data
        console.log(data);
        if (data['passed'] === true) {
          Users.statChange($scope.user, 1); // # of times to increase the wins. Should be 1 always
          $rootScope.battleSocket.emit('winnerFound');
          $scope.userNotes = "All tests passing!";
          alert('You have the answer. Good job!');
          $location.path('/dashboard'); //redirect back. winner found
        }
      });
  };





  ////////////////////////////////////////////////////////////
  // reload page to ask for permission to use webcam
  ////////////////////////////////////////////////////////////

  $scope.askPermission = function(){

    var comm = new Icecomm('wRHqiZLmDMX6RnLrm2O04ouIqqxd0MiQpVpaAIDz5cPS0ta');

    comm.connect('custom room');

    comm.on('connected', function(peer) {
       // document.body.appendChild(peer.getVideo());
       var node = document.createElement("video");
       var attr1 = document.createAttribute("class");
        attr1.value = "peer";
       var attr2 = document.createAttribute("id");
        attr2.value = peer.ID;
       var attr3 = document.createAttribute("autoplay");

       document.getElementById("peer").appendChild(node);
       node.setAttributeNode(attr1);
       node.setAttributeNode(attr2);
       node.setAttributeNode(attr3);
       
       var remoteVid = document.getElementById(peer.ID);
       remoteVid.src = peer.stream;
       // console.log('peer remote>>>', peer);
       // console.log('peer.ID remote>>>', document.getElementById(peer.ID));
       // console.log(peer.ID, peer.stream);
    });

    comm.on('local', function(peer) {
      console.log('localVideo>>>', localVideo);
      console.log('localVideo.src>>>', localVideo.src);
      console.log('peer.stream>>>', peer.stream);
      console.log('peer local>>>', peer);
      localVideo.src = peer.stream;
    });

    comm.on('disconnect', function(peer) {
      document.getElementById(peer.ID).remove();
    });

  };

});
