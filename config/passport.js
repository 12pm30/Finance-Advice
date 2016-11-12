var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../backend/models/users');
var Expenses = require('../backend/models/expenses');


module.exports = function(passport) {

  //This will serialize and deserialize
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });


  //Middleware
  passport.use('local-login',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req ,email, password, done) {
    User.findOne({ email: email }, function(err, user){
      if(err) return done(err);

      if(!user){
        return done(null, false, req.flash('loginMessage', 'User does not exist! Create an account now!'));
      }

      if(!user.validPassword(password)){
        return done(null, false, req.flash('loginMessage', 'Incorrect username or password'));
      }
      return done(null, user);
    });
  }

));



passport.use('local-signup', new LocalStrategy({

    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
},
function(req, email, password, done) {

    User.findOne({ 'email' :  email }, function(err, user) {

      console.log("im routing");

        if (err)
            return done(err);

        //check if email already exists

        if (user)
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));

        else {

            // if there is no user with that email
            // create the user
            var newUser            = new User();

            newUser.firstname = req.body.firstname;
            newUser.lastname = req.body.lastname;
            newUser.email = email;
            newUser.password = newUser.generateHash(password);
          /*  for(var i=0;i<12;i++){
              console.log(i);
              newUser.expenses.monthly.push()year = 2016;
              newUser.expenses.monthly[i].rent = 100;
              newUser.expesnes.monthly[i].bills = 100;
              newUser.expesnes.monthly[i].transportation = 100;
              newUser.expenses.monthly[i];
            }
            newUser.expenses.monthly.push(rent=100);
            newUser.expenses.yearly.tuition = 100;
            newUser.expenses.yearly.debt = 100;
            newUser.expenses.yearly.year = 2016;*/


            newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });
        }
    });
}));


//Custom validator function
exports.isAuthenticated = function(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}
};
