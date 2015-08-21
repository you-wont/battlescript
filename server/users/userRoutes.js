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
  app.get('/login/facebook/callback',function(req,resp,next){
    passport.authenticate('facebook',{ session: false, failureRedirect: "/signedin" },
    function(err, token){
      console.log('SOS')
      console.log('session set' + JSON.stringify(token))
      resp.cookie('facebookToken', JSON.stringify(token), { maxAge: 900000});
      //resp.setHeader({"Content-Type":'text/javascript'})
      //resp.jsonp({token:token});
      resp.redirect('/');

    })(req,resp,next);
  });
    
 

};
//