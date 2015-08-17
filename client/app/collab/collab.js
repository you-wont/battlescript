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

      var userId = Math.floor(Math.random() * 9999999999).toString();
      var codeMirror = CodeMirror(document.getElementById('firepad-container'), 
        { mode:  "javascript" });
      // var session = codeMirror.getSession();
      // session.setUseWrapMode(true);
      // session.setUseWorker(false);
      // session.setMode("ace/mode/javascript");

      //// Create Firepad.
      var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
          {defaultText: '// JavaScript Editing with Firepad!', userId: userId});



      // var editor = ace.edit("firepad-container");
      // editor.setTheme("ace/theme/textmate");

      var firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'),
          document.getElementById('userlist'), userId, $scope.currentUser );

});




