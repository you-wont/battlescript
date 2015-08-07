angular.module('battlescript.main', [])

.controller('MainController', function ($scope, Main) {
  $scope.variable = 'BattleScript is gonna fucking rock';

  $scope.filterFunction = function(result) {
    // USE THIS IF YOU NEED TO FILTER NG-REPEAT
  }

  $scope.sayHi = function(){
    console.log('Hi! : ', $scope.seeFavorites);
  }

  // $scope.getLinks();
});


