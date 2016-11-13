var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

//var User = require('../backend/models/users');
//var Expenses = require('../backend/models/expenses');


module.exports = function(passport) {

  //This will serialize and deserialize
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done){
    var email;
    if(user.EMAIL)
        email=user.EMAIL;
    else if(user.email)
        email=user.email;
    connection.query("SELECT * FROM USERS WHERE EMAIL = ? ",[email], function(err, rows){
      done(err, rows[0]);
    });
  });


  //Middleware
  passport.use('local-login',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req ,email, password, done) {

    connection.query("SELECT * FROM USERS WHERE email = ?",[email], function(err, rows){
      if (err)
      return done(err);
      if (!rows.length) {
        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
      }

      // if the user is found but the password is wrong
      if (password!=rows[0].PASSWORD)
      return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

      // all is well, return successful user
      return done(null, rows[0]);
    });
  }

));



passport.use('local-signup', new LocalStrategy({

  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
},
function(req, email, password, done) {

  connection.query("SELECT * FROM USERS WHERE email = ?",[email], function(err, rows) {
    if (err)
    return done(err);
    if (rows.length) {
      return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
    } else {
      // if there is no user with that username
      // create the user
      var newUserMysql = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: email,
        password: password  // use the generateHash function in our user model
      };

      var insertQuery = "INSERT INTO USERS ( FIRSTNAME, LASTNAME,EMAIL, PASSWORD ) values (?,?,?,?)";

      connection.query(insertQuery,[newUserMysql.firstname, newUserMysql.lastname, newUserMysql.email, newUserMysql.password],function(err, rows) {
        //newUserMysql.id = rows.insertId;

        return done(null, newUserMysql);
      });
    };
  })
} ) );

  //Custom validator function
  exports.isAuthenticated = function(req, res, next) {
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/login');
  }
};
