angular.module('battlescript', [
  'battlescript.services',
  'battlescript.auth',
  'battlescript.main',
  'ngRoute' // MAY WANT TO CHANGE TO UI ROUTER
])
.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/signin', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .when('/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .when('/logout', {
      templateUrl: 'app/auth/logout.html',
      controller: 'AuthController'
    })
    .when('/', {
      templateUrl: 'app/main/main.html',
      controller: 'MainController'
    })

    $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('battlepro'); // CHANGE THIS TO ANOTHER SECRET
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && !Auth.isAuth()) {
      $rootScope.signedIn = false;
      if(next.$$route.originalPath === "/signup"){
        $location.path('/signup');
      } else {
        $location.path('/signin');
      }
    } else {
      $rootScope.signedIn = true;
    }
  });
});
