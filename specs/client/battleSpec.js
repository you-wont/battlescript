describe('BattleController', function () {

  var $scope;
  var $rootScope;
  var $location;
  var $window;
  var $httpBackend;
  var createController;
  var Auth;

  beforeEach(module('battlescript'));

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $window = $injector.get('$window');
    $httpBackend = $injector.get('$httpBackend');
    Auth = $injector.get('Auth');
    $scope = $rootScope.$new();
    
    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('BattleController', {
        $scope: $scope,
        $window: $window,
        $location: $location,
        Auth: Auth
      });
    };

    createController();

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $window.localStorage.removeItem('battlepro');
  });

  xit('should have a spinnerOn property', function() {
    expect($scope.spinnerOn).toBeDefined();
  });

});