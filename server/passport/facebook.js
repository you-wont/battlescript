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
      callbackURL: fbConfig.callbackUrl,
      enableProof: true
    },
    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {
    	console.log('profile', profile);
    	var findOrCreateUser = function(){
    		console.log('beginning DB process')
            console.log(User.find())
    		var findOne = Q.nbind(User.findOne,User);
    		findOne({facebookUserID:profile.id})
    		.then(function(user){
    			if (user){
    				//creat jwt
    				user.save();

    				// create token to send back for auth
    				var token = jwt.encode(user, 'secret');
    				//find a way to send response
    				//res.json({token: token});
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
    				console.log('trying to save')
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