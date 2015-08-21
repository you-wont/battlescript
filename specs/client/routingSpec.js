describe('Routing', function () {

  var $state;
  
  beforeEach(module('battlescript'));

  beforeEach(inject(function($injector){
    $state = $injector.get('$state');
  }));

  it('Should have /signup route, template, and controller', function () {
    expect($state).not.toBe(null);
  });

});