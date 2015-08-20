var facebook = require('./facebook');
var User = require('../users/userModel');

module.exports = function(passport){
    console.log('heloo')
	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
       // console.log('serializing user: ');console.log(user);
       user = user || {};
       console.log('serializing')
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {
        //User.findById(id, function(err, user) {
            console.log('deserializing user:',user);
            user = user || {};
            done(null, user);
        //});
    });

    // Setting up Passport Strategies for Facebook
    
    facebook(passport);
 
    

}