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
  	app.get('/login/facebook', 
  		passport.authenticate('facebook', { scope : 'email' }
  	));

  	// handle the callback after facebook has authenticated the user
  	app.get('/login/facebook/callback',
  		passport.authenticate('facebook', {
  			successRedirect : '/home',
  			failureRedirect : '/'
  		})
  	);


};
