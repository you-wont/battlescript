module.exports = function(app, passport, db, bcrypt) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req, res) {
    res.render('index'); 
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login' }));

  // process the login form
  // app.post('/login', do all our passport stuff here);

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup');
  });

  // process the signup form
  app.post('/signup', function(req, res){
    db.User.findOne({username: req.body.username}).then(function(model){
      if (model) {
        res.redirect('/login')
      } else {
        bcrypt.hash(req.body.password, null, null, function(err, result) {
          if (err) {
            throw err;
          }
          db.User.create({username: req.body.username, password: result});    
        })
      }
    });
  });

  app.get('/auth', function(req, res){
    res.send(req.isAuthenticated());
  });

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)

  // app.get('/profile', isLoggedIn, function(req, res) {
  //   res.render('profile');
  // });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.post('/logout', function(req, res) {
    req.logout();
  });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.send(401);
}