angular.module('battlescript.auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {};

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function () {
        $location.path('/links');
      })
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function () {
        $location.path('/');
      })
  };
});
