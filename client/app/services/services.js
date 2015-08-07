angular.module('battlescript.services', [])



//###########################################################################
.factory('Main',function ($http){
  return {
    sampleFunction: function(){
      console.log("I'm in a sample function");
    }
  }

})


// THE SEARCH AND PREFERENCE FUNCTIONS ARE ONLY HERE FOR REFERENCE
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
// THE SEARCH AND PREFERENCE FUNCTIONS ARE ONLY HERE FOR REFERENCE
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

})
//###########################################################################

.factory('Auth', function ($http, $location, $window) {
  // Don't touch this Auth service!!!
  // it is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'battlepro'
  // after you signin/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server
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
});
