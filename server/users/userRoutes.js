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
    // route for facebook authentication and login
  	// different scopes while logging in
  app.get('/login/facebook', function(req,res,next){
    console.log('login section')
      passport.authenticate('facebook',{scope:['email']},function(req,res){
        
      })(req, res, next);
    
      return;
  });

  	// handle the callback after facebook has authenticated the user
  app.get('login/facebook/callback',function(req,res,next){
    console.log('callback section')
    passport.authenticate('facebook', {
      successRedirect : '/stats',
      failureRedirect : '/stats'
    })(req,res,next);
  });

 /*
  passport.authenticate('facebook', {
      successRedirect : '/stats',
      failureRedirect : '/stats'
    })
 */
//passport.authenticate('facebook',{ scope : ['email'] })

};
