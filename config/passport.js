var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../backend/models/users');

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
  passport.use('local',new LocalStrategy({
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

      if(!user.verifyPassword(password)){
        return done(null, false, req.flash('loginMessage', 'Incorrect username or password'));
      }
      return done(null, user);
    });
  }

));


//Custom validator function
exports.isAuthenticated = function(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}
};
