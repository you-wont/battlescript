////////////////////////////////////////////////////////////
// bootstrap the app and all services and controllers
////////////////////////////////////////////////////////////

angular.module('battlescript', [
  'battlescript.services',
  'battlescript.directives',
  'battlescript.auth',
  'battlescript.home',
  'battlescript.dashboard',
  'battlescript.battle',
  'ui.router',
  'ngSanitize',
  'ngAnimate'
])

////////////////////////////////////////////////////////////
// config the app states
////////////////////////////////////////////////////////////

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/home/home.html',
      controller: 'HomeController'
    })
    .state('signin', {
      url: '/signin',
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .state('logout', {
      url: '/logout',
      templateUrl: 'app/auth/logout.html',
      controller: 'AuthController'
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'app/dashboard/dashboard.html',
      controller: 'DashboardController',
      authenticate: true
    })
    .state('battleroom', {
      url: '/battle/:id',
      templateUrl: 'app/battle/battle.html',
      controller: 'BattleController',
      authenticate: true
    });

    $urlRouterProvider.otherwise('/');
})

////////////////////////////////////////////////////////////
// config the app tokens
////////////////////////////////////////////////////////////

.config(function($httpProvider) {
  $httpProvider.interceptors.push('AttachTokens');
})

////////////////////////////////////////////////////////////
// run the style
////////////////////////////////////////////////////////////

.run(function ($rootScope, $location, Auth, Users, Socket) {

  ////////////////////////////////////////////////////////////
  // dashboard sockets
  ////////////////////////////////////////////////////////////

  // start it up but leave it empty
  $rootScope.dashboardSocket = null;
  
  // only create socket first time when auth and hits dash
  $rootScope.$on('$stateChangeStart', function(evt, next, current) {
    if (next && Auth.isAuth() && next.name === 'dashboard' && !$rootScope.dashboardSocket) {
      $rootScope.dashboardSocket = Socket.createSocket('dashboard', [
        'username=' + Users.getAuthUser(),
        'handler=dashboard'
      ]);

      $rootScope.dashboardSocket.on('connect', function() {
        $rootScope.initDashboardSocketEvents();
      });
    }
  });

  // initialise dash socket events
  $rootScope.initDashboardSocketEvents = function() {
    // state change and socket handling
    $rootScope.$on('$stateChangeStart', function(evt, next, current) {
      if (next.name !== 'dashboard') {
        $rootScope.dashboardSocket.disconnect();
      } else if (next.name === 'dashboard') {
        $rootScope.dashboardSocket.connect();
      }
    });

    // listen for socket disconnection
    $rootScope.dashboardSocket.on('disconnect', function() {
      // console.log('socket disconnected');
    });
  };

  ////////////////////////////////////////////////////////////
  // battle sockets
  ////////////////////////////////////////////////////////////

  $rootScope.battleSocket;

  $rootScope.initBattleSocket = function(roomhash, cb) {
    
    // still check here
    if (Auth.isAuth() /* && !$rootScope.battleSocket */) {
      // now time to set up the battle socket
      $rootScope.battleSocket = Socket.createSocket('battle', [
        'username=' + Users.getAuthUser(),
        'handler=battle',
        'roomhash=' + roomhash
      ]);

      $rootScope.battleSocket.on('connect', function() {
        $rootScope.initBattleSocketEvents(cb);
      });
    }
  };

  // initialise dash socket events
  $rootScope.initBattleSocketEvents = function(cb) {
    // console.log('init the battle events');
    // state change and socket handling
    $rootScope.$on('$stateChangeStart', function(evt, next, current) {
      if (next.name !== 'battleroom') {
        $rootScope.battleSocket.emit('disconnectedClient', {username: Users.getAuthUser()});
        $rootScope.battleSocket.disconnect();
      }
    });

    // refresh handler
    window.onbeforeunload = function(e) {
      $rootScope.battleSocket.emit('disconnectedClient', {username: Users.getAuthUser()});
      $rootScope.battleSocket.disconnect();
    };

    // listen for socket disconnection
    $rootScope.battleSocket.on('disconnect', function() {
      // console.log('battle socket disconnected');
    });

    // run the callback
    cb();
  };


  ////////////////////////////////////////////////////////////
  // handle auth stuffs
  ////////////////////////////////////////////////////////////

  $rootScope.$on('$stateChangeStart', function (evt, next, current) {
    // redirect home if auth required and user isn't auth
    if (next && next.authenticate && !Auth.isAuth()) {
      $location.path('/');
    }

    // redirect to dashboard if user is auth and tries to access home page
    if (next && next.url === '/' && Auth.isAuth()) {
      $location.path('/dashboard');
    }
  });
});
