//Passport - FB Oauth Strategy - Jonathan Schapiro
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../users/userModel.js');
var Q = require('q');
var jwt = require('jwt-simple');
var fbConfig = require('../fb.js');

module.exports = function(passport) {

  passport.use('facebook', new FacebookStrategy({
      clientID: fbConfig.appID,
      clientSecret: fbConfig.appSecret,
      callbackURL: fbConfig.callbackUrl,
      enableProof: true,
      //passReqToCallback: true
    },
    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {
      console.log('profile', profile);
      var findOne = Q.nbind(User.findOne,User);
      
      findOne({facebookUserID:profile.id}).
      then(function(user){
        //user exists
        if (user){
          //append token
          var token = jwt.encode(user, 'secret');
          user.facebookToken = token;
          
          console.log('user exists')
          user.save(function(err,doc){
            console.log('done resaving')
            return done(null,token);
          });
          
        } else {
          //user doesn't exist - create a new one
          var create = Q.nbind(User.create,User);
          var newUser = {
              username:profile.displayName,
              facebookUserID:profile.id
          };
          return create(newUser);
        }
      }).then(function(user){
        if (user){
          var token = jwt.encode(user, 'secret');
          user.facebookToken = token;
          user.save(function(err,doc){
            return done(null,token)
          });
        }
        
      })
      .fail(function(error){
        console.error('error: ' + error)
      })


      // asynchronous
      /*process.nextTick(function() {
        done(null, profile)
      });*/

    }));

};