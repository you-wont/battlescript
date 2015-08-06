var LocalStrategy = require('passport-local').Strategy;

module.exports = function(db){
  return {

    strategy: new LocalStrategy(function(username, password, done) {
      db.User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false);
        }
        if (!user.validPassword(password)) {
          return done(null, false);
        }
        return done(null, user);
      });

      
    }),

    serialization: function(user, done) {
      done(null, user.id);
    },

    deserialization: function(id, done, User) {
      db.User.findById(id, function(err, user) {
        done(err, user);
      });
    }

  }
}


