module.exports = function(app,passport){


    app.get('/', function(req, res){
        res.render('index');
    });

    //LOGIN
    app.get('/login', function(req,res){
      if (req.isAuthenticated())
          res.redirect('/');
      else
          res.render('login', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/dashboard',
        failureRedirect : '/login',
        failureFlash : true
    }));

    //SIGN UP

    app.get('/signup', function(req,res){
        res.render('signup');
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/dashboard',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    //logout

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    //dashboard

    app.get('/dashboard', function(req,res){
      res.send('Login successful.... this is the temporary dashboard');
    });

    //expenses

    app.get('/expenses', isLoggedIn, function(req,res){
          res.render('expenses',{ user : req.user});
    });

    app.post('/expenses', function(req,res){

      var User = require('../models/users');

      User.findOne({ 'email' :  req.user.email }, function(err, user) {
          var current = req.user.expenses;
          var body = req.body;
          console.log(body);
          console.log(current);
          if(body.rent!="")
              current.monthly.rent = body.rent;
          if(body.bills!="")
              current.monthly.bills = body.bills;
          if(body.tranporttion!="")
              current.monthly.transportation=body.transportation;
          if(body.tuition!="")
              current.yearly.tuition=body.tuition;
          if(body.debt!="")
              current.yearly.debt=body.debt;

          current.save(function(err) {
              if (err)
                  console.log('didnt save');
              else
                res.redirect('/dashboard');
          });

      });

    })
}

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
