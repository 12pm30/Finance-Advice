module.exports = function(app,passport){
var mysql = require('mysql');
    var dbconfig = require('../../config/database');
        var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

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

          connection.query("SELECT * FROM BALADJUST WHERE UID = ? ",[req.user.UID], function(err, rows){
              
                      if(!rows.length)
                                    res.render('dashboard',{user:req.user, message:'no_data'});
                              else 
                                            res.render('dashboard',{user: req.user, message:'data',data:rows});
                                            });
                                      });
    //expenses

    app.get('/expenses', isLoggedIn, function(req,res){
          res.render('expenses',{ user : req.user});
    });

    app.post('/expenses', function(req,res){
    var mysql = require('mysql');
    var dbconfig = require('../../config/database');    
    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);
      var userID = req.user.UID;
      var body =req.body;
      var now = Date.now();
      var d = new Date(now);
      var insertQuery = "INSERT INTO BALADJUST (UID, AMOUNT, APPLIED, YEAR,MONTH,TYPE ) values (?,?,?,?,?,?)";

      if(body.rent!=""){

        //CREATE NEW EXPENSES ENTRY FOR USER'S RENT
        connection.query(insertQuery,[userID, body.rent, true, d.getFullYear(),d.getMonth(),'RENT']);
      }
      if(body.bills!=""){

        //CREATE NEW EXPENSES ENTRY FOR USER'S BILLS
        connection.query(insertQuery,[userID, body.bills, true, d.getFullYear(),d.getMonth(),'BILLS']); 
    }
      if(body.transportation!=""){

        //CREATE NEW EXPENSES ENTRY FOR USER'S transportation
        connection.query(insertQuery,[userID, body.transportation, true, d.getFullYear(),d.getMonth(),'TRANSPORTATION']); 

    }
      if(body.tuition!=""){
        //CREATE NEW EXPENSES ENTRY FOR USER'S TUITION
        connection.query(insertQuery,[userID, body.tuition, true, d.getFullYear(),null,'TUITION']); 

    }
      if(body.debt!=""){
        //CREATE NEW EXPENSES ENTRY FOR USER'S DEBT
connection.query(insertQuery,[userID, body.debt, true, d.getFullYear(),null,'DEBT']); 
    }

//IF successful then uncomment the line below else display error
 res.render('dashboard');

    })

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
}
