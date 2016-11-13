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
    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);
      //var User = require('../models/users');
      //var Expense = require('../models/expenses');
      var userID = req.user.UID;
      var body =req.body;
      var now = Date.now();
      var d = new Date(now);

      var error = 0;

      var newExpense = new Expense();
      var insertQuery = "INSERT INTO BALADJUST (UID, AMOUNT, APPLIED, YEAR,MONTH,TYPE ) values (?,?,?,?,?,?)";

connection.query(insertQuery,[newUserMysql.firstname, newUserMysql.lastname, newUserMysql.email, newUserMysql.password],function(err, rows) {

      console.log(body);
      var valuesQuer=")";
      if(body.rent!=""){

        //CREATE NEW EXPENSES ENTRY FOR USER'S RENT
        connection.query(insetQuery,[userID, body.rent, true, d.getFullYear(),d.getMonth(),'RENT']);

      }
      if(body.bills!=""){

        //CREATE NEW EXPENSES ENTRY FOR USER'S BILLS
        connection.query(insetQuery,[userID, body.bills, true, d.getFullYear(),d.getMonth(),'BILLS']); 
    }
      if(body.transportation!=""){

        //CREATE NEW EXPENSES ENTRY FOR USER'S transportation
        connection.query(insetQuery,[userID, body.transportation, true, d.getFullYear(),d.getMonth(),'TRANSPORTATION']); 

    }
      if(body.tuition!=""){
        //CREATE NEW EXPENSES ENTRY FOR USER'S TUITION
        connection.query(insetQuery,[userID, body.tuition, true, d.getFullYear(),null,'TUITION']); 

    }
      if(body.debt!=""){
        //CREATE NEW EXPENSES ENTRY FOR USER'S DEBT
connection.query(insetQuery,[userID, body.debt, true, d.getFullYear(),null,'DEBT']); 
    }

//IF successful then uncomment the line below else display error
 res.render('dashboard');

    })

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
