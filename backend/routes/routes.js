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

    app.get('/dashboard',isLoggedIn, function(req,res){
      res.render('dashboard',{ user : req.user});
    });

    //expenses

    app.get('/expenses', isLoggedIn, function(req,res){
          res.render('expenses',{ user : req.user});
    });

    app.post('/expenses', function(req,res){

      var User = require('../models/users');
      var Expense = require('../models/expenses');
      var userID = req.user._id;
      var body =req.body;
      var now = Date.now();
      var d = new Date(now);
      var date = d.getDate() + '-' + (d.getMonth()+1) +  '-' + d.getFullYear();

      var error = 0;

      var newExpense = new Expense();

      console.log(body);

      if(body.rent!=""){

        //CREATE NEW EXPENSES ENTRY FOR USER'S RENT


      }
      if(body.bills!=""){

        //CREATE NEW EXPENSES ENTRY FOR USER'S BILLS
    }
      if(body.tranportation!=""){

        //CREATE NEW EXPENSES ENTRY FOR USER'S transportation

    }
      if(body.tuition!=""){
        //CREATE NEW EXPENSES ENTRY FOR USER'S TUITION
        var newExpense4 = new Expense();

    }
      if(body.debt!=""){
        //CREATE NEW EXPENSES ENTRY FOR USER'S DEBT

    }

//IF successful then uncomment the line below else display error
// res.render('dashboard');


    })
}

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
