angular.module('shortly.services', [])


.factory('Auth', function($q, $timeout, $http, $location, $rootScope, $window))
  var isAuth = function(cb){
  // Initialize a new promise 
    $http.get('/auth').success(function(isAuth){ 
      cb(isAuth)
    });
  }

  var signin = function(cb) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
  }

  var signup = function(user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
  }

  var signout = function(cb) {
    $http.post('/logout').success(function(){
      $location.path('/signin');
    })

  }

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
}