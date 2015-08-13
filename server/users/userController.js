var User = require('./userModel.js'),
    Q    = require('q'),
    jwt  = require('jwt-simple');

var currentUsers = {};

module.exports = {
  signin: function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
      .then(function (user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              if (foundUser) {
                var token = jwt.encode(user, 'secret');
                res.json({token: token});

                //Set the user to be online
                user.onlineStatus = true;
                user.save();

                //save the user to currentUsers array
                currentUsers[user.username] = user;
                console.log("CURRENT USER LIST :", currentUsers);

              } else {
                return next(new Error('No user'));
              }
            });
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  signup: function (req, res, next) {
    var username  = req.body.username,
        password  = req.body.password,
        create,
        newUser;

    var findOne = Q.nbind(User.findOne, User);

    // check to see if user already exists
    findOne({username: username})
      .then(function(user) {
        if (user) {
          next(new Error('User already exists!'));
        } else {
          // make a new user if not one
          create = Q.nbind(User.create, User);
          newUser = {
            username: username,
            password: password
          };
          return create(newUser);
        }
      })
      .then(function (user) {
        
        //Set the user to be online
        user.onlineStatus = true;
        user.save();

        // save user to current user array - DELETE THIS LATER
        currentUsers[user.username] = user;
        console.log("CURRENT USER LIST :", currentUsers);

        // create token to send back for auth
        var token = jwt.encode(user, 'secret');
        res.json({token: token});
      })
      .fail(function (error) {
        next(error);
      });
  },

  checkAuth: function (req, res, next) {
    // checking to see if the user is authenticated
    // grab the token in the header is any
    // then decode the token, which we end up being the user object
    // check to see if that user exists in the database
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function (foundUser) {
          if (foundUser) {
            res.send(200);
          } else {
            res.send(401);
          }
        })
        .fail(function (error) {
          next(error);
        });
    }
  },

  signout: function (req, res, next){
      console.log("this is req.body",req.body);
      var username = req.body.username;
      var findUser = Q.nbind(User.findOne, User);
      
      findUser({username: username})
        .then(function (user) {

          // set user to be offline
          user.onlineStatus = false;
          user.save();
          
          // remove user from currentonline user list - DELETE THIS LATER
          var username = user.username;
          delete currentUsers[username];

          // console.log('THIS IS USER', user)
          // console.log("this is username", username);
          // console.log(">>>> when log out",currentUsers)
        });
  },

  getOnlineUsers: function (req, res, next){
    //console.log("SENDING CURRENT USERS ", currentUsers);
    var findUsers = Q.nbind(User.find, User);
    findUsers({onlineStatus: true})
    .then(function(onlineUsers){
      console.log("SENDING ONLINE USERS");
      res.send(onlineUsers)
    })

    // res.send(currentUsers);
  }
};
