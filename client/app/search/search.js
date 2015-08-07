angular.module('shortly.search', [])

.controller('SearchController', function ($scope, Search, Preference) {
  $scope.results = [];
  $scope.location = {
    text: ""
  };
  $scope.distance = {
    walking: true,
    driving: false,
    walkingTime: ''
  };
  $scope.searchQuery = 'restaurants';
  $scope.seeFavorites = true;
  $scope.resultsServed = false;

  $scope.filterFunction = function(result) {
    // THIS WILL FILTER BASED ON IF USERS WANT TO SEE RESTAURANTS 
    if (result.hate){
      return false;
    }
    if ($scope.seeFavorites){
      return true;
    } else {
      if (result.love) {
        return false;
      }
      return true;
    }
  }

  $scope.getResults = function() {
    console.log("GETTING RESULTS");
    var searchData = {
      location: $scope.location,
      distance: $scope.distance
    };
    Search.getResults(searchData, function(data){
      $scope.results = data.businesses;
      console.log(data);
      $scope.resultsServed = true;
    })
  };

  $scope.love = function(business){
    business.love = true;
    business.visited = true;
    business.hate = false;
    console.log("CLICKED! ", business.name);
    Preference.save(business, function(data){
      console.log("SAVED IN DATABASE!", data);
    });
  }

  $scope.hate = function(business){
    business.love = false;
    business.visited = true;
    business.hate = true;
    Preference.save(business, function(data){
      console.log("SAVED IN DATABASE!", data);
    });
  }

  $scope.sayHi = function(){
    console.log('Hi! : ', $scope.seeFavorites);
  }

  // $scope.getLinks();
});


