module.exports = function(app,passport){

    app.get('/', function(req, res){
        res.render('index');
    });

    app.get('/login', function(req,res){
      if (req.isAuthenticated())
          res.redirect('/');
      else
          res.render('login', { message: req.flash('loginMessage') });
    });

    app.get('/signup', function(req,res){
        res.render('signup');
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/dashboard',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/dashboard',
        failureRedirect : '/login',
        failureFlash : true
    }));

    app.get('/dashboard', function(req,res){
      res.send('Login successful.... this is the temporary dashboard');
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
}
