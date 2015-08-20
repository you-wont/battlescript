var userController = require('./userController.js');


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
  app.get('/login/facebook/callback',passport.authenticate('facebook',{ session: false, failureRedirect: "/" }),
    function(req,resp,next){
       resp.redirect("/");
    });


};
//