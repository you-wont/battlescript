angular.module('battlescript.collab', [])

.controller('CollabController', function ($scope, $location, Users) {

  $scope.currentUser = Users.getAuthUser();
  $scope.userInfo = {username: $scope.currentUser};

  //// Initialize Firebase.
  var firepadRef = new Firebase('https://battlescript.firebaseio.com/');

  ///perform hashing on the room
  var hash = window.location.hash.replace(/#/g, '');
      if (hash) {
        console.log(hash)
        firepadRef = firepadRef.child(hash);
        console.log(firepadRef.toString());
      } else {
        firepadRef = firepadRef.push(); // generate unique location.
        window.location = window.location + '#' + firepadRef.key(); // add it as a hash to the URL.
        console.log(firepadRef.toString());
      }
      
      if (typeof console !== 'undefined')
        console.log('Firebase data: ', firepadRef.toString());


      var editor = ace.edit("firepad-container");
      editor.setTheme("ace/theme/textmate");
      var session = editor.getSession();
      session.setUseWrapMode(true);
      session.setUseWorker(false);
      session.setMode("ace/mode/javascript");

      var userId = Math.floor(Math.random() * 9999999999).toString();

      //// Create Firepad.
      var firepad = Firepad.fromACE(firepadRef, editor, {
        defaultText: '// JavaScript Editing with Firepad!\nfunction go() {\n  var message = "Hello, world.";\n  console.log(message);\n}', userId: userId
      });

      var firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'),
          document.getElementById('userlist'), userId, $scope.currentUser );

});




