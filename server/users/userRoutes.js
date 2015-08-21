var userController = require('./userController.js');
var util = require('util');



module.exports = function (app,passport) {
  // app === userRouter injected from middlware.js

  app.post('/signin',userController.signin);
  app.post('/signup', userController.signup);
  app.get('/signedin', userController.checkAuth);
  app.post('/signout', userController.signout);
  app.get('/stats', userController.stats);
  app.post('/statchange', userController.statChange);
  app.get('/leaderboard', userController.leaderboard);
  
  //Passport - Facebook OAuth routes - Jonathan Schapiro
  app.get('/login/facebook',passport.authenticate('facebook',{ session: false, scope: ['email'] }));
  app.get('/login/facebook/callback',passport.authenticate('facebook',{ session: false, failureRedirect: "/signedin" }),
    function(req,resp,next){
      console.log('SOS')
      console.log('resp: ')
      console.log(util.inspect(req.user, false, null));
      req.session.token = resp.user;
      if (req.session.token){
        console.log('session set')
      }
      resp.setHeader('content-type', 'text/javascript');
      resp.jsonp({token: req.session.token});
     //resp.redirect("/");
      //resp.json({token: req.user});
    });
 

};
//