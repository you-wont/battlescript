////////////////////////////////////////////////////////////
// directives module
////////////////////////////////////////////////////////////

var directives = angular.module('battlescript.directives', []);

////////////////////////////////////////////////////////////
// boot up app directives
// 
// - headerMain: the main header bar for auth'd users
// - headerLogout: a directive specifically for logout
// - headerNoAuthPartial: a directive for rendering a static
//   HTML header on the signup/signin pages
// - footerPartial: a static html directive for the footer
////////////////////////////////////////////////////////////

directives.directive('headerMain', function() {
  return {
    restrict: 'E',
    scope: {
      userInfo: '=userInfo'
    },
    templateUrl: 'app/directives/header-main.html'
  };
});

directives.directive('headerLogout', function() {
  var link = function(scope, element, attrs) {
    element.bind('click', function(e) {
      e.preventDefault();
      scope.$parent.$apply(attrs.logout);
    });
  };

  return {
    link: link,
    restrict: 'E',
    templateUrl: 'app/directives/header-logout.html'
  };
});

directives.directive('headerNonAuthPartial', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/header-nonauth.html'
  };
});

directives.directive('footerPartial', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/footer.html'
  };
});