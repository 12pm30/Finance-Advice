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

        var newExpense1 = new Expense();

        newExpense1.user_id = userID;
        newExpense1.type = 'rent';
        newExpense1.amount= body.rent;
        newExpense1.month = d.getMonth()+1;
        newExpense1.year = d.getFullYear();

        newExpense1.save(function(err) {
            if (err)
                error=1;
        });

      }
      if(body.bills!=""){
        var newExpense2 = new Expense();
        newExpense2.user_id = userID;
        newExpense2.type = 'bills';
        newExpense2.amount= body.bills;
        newExpense2.month = d.getMonth()+1;
        newExpense2.year = d.getFullYear();
        newExpense2.save(function(err) {
            if (err)
                error=1;
      });
    }
      if(body.tranportation!=""){
        var newExpense3 = new Expense();
        newExpense3.user_id = userID;
        newExpense3.type = 'transportation';
        newExpense3.amount= body.transportation;
        newExpense3.month = d.getMonth()+1;
        newExpense3.year = d.getFullYear();
        newExpense3.save(function(err) {
            if (err)
                error=1;
      });
    }
      if(body.tuition!=""){
        var newExpense4 = new Expense();
        newExpense4.user_id = userID;
        newExpense4.type = 'tuition';
        newExpense4.amount= body.tuition;
        newExpense4.month = null;
        newExpense4.year = d.getFullYear();
        newExpense4.save(function(err) {
            if (err)
                error=1;
      });
    }
      if(body.debt!=""){
        var newExpense5 = new Expense();
        newExpense5.user_id = userID;
        newExpense5.type = 'debt';
        newExpense5.amount= body.debt;
        newExpense5.month = null;
        newExpense5.year = d.getFullYear();
        newExpense5.save(function(err) {
            if (err)
                error=1;
      });
    }

          if (error==1)
              console.log('didnt save');
          else
            res.redirect('/dashboard');



/*      Expense.findOne({ 'user_id' :  userID }, function(err, user) {

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

      });*/

    })
}

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
