angular.module('battlescript.services', [])

// Main Factory
.factory('Main',function ($http){
  return {
    sampleFunction: function(){
      console.log("I'm in a sample function");
    }
  }

})

// Auth factory
.factory('Auth', function ($http, $location, $window) {
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('battlepro');
  };

  var signout = function () {
    $window.localStorage.removeItem('battlepro');
    $location.path('/signin');
  };


  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
})

// The duels factory
.factory('Duel', function($http) {

  // gets a duel
  var getDuel = function() {
    return $http({
      method: 'GET',
      url: '/api/duels/getduel',
    }).then(function(res) {
      return res.data;
    });
  };

  return {
    getDuel: getDuel
  }
})

// The search factory (if we need it)
.factory('Search', function ($http){
  return {
    getResults: function(searchData, callback){
      $http({
        method: 'POST',
        url: '/api/search',
        data: searchData
      })
      .then(function(resp){
        console.log("GOT RESPONSE FROM SERVER!")
        callback(resp.data)
      });
    }
  }

})

// The preference factory (if we need it)
.factory('Preference', function ($http){
  return {
    save: function(preferences, callback){
      $http({
        method: 'POST',
        url: '/api/search/preferences',
        data: preferences
      })
      .then(function(resp){
        console.log("GOT RESPONSE FROM SERVER!")
        callback(resp.data);
      });
    }
  }

});
