angular.module('battlescript.dashboard', [])

.controller('DashboardController', function ($scope, Dashboard) {
  $scope.getUsers = function($event){
    $event.preventDefault();
    Dashboard.getUsers();
  }
});