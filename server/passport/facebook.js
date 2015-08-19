//Passport - FB Oauth Strategy - Jonathan Schapiro
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../users/userModel.js');
var Q    = require('q');
var jwt  = require('jwt-simple');
var fbConfig = require('../fb.js');

module.exports = function(passport) {
  passport.use('facebook', new FacebookStrategy({
      clientID: fbConfig.appID,
      clientSecret: fbConfig.appSecret,
      callbackURL: fbConfig.callbackUrl
    },
    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {
    	console.log('profile', profile);
    	var findOrCreateUser = function(){
    		var findOne = Q.nbind(User.findOne,User);
    		findOne({id:profile.id})
    		.then(function(user){
    			if (user){
    				//creat jwt
    				console.log('user exists!')
    			} else {
    				//create new user
    				var create = Q.nbind(User.create,User);
    				var newUser = {
    					username:profile.displayName,
    					facebookUserID:profile.id
    				};
    				return create(newUser);
    			}
    		})
    		.then(function(user){
    				//save the user
    				user.save();
    				console.log('user successfully created!')
    		})
    		.fail(function(error){
    			console.log("error: " + error)
    		})
    	}
      
      done(null, profile);

      // asynchronous
      process.nextTick(findOrCreateUser);

    }));

};