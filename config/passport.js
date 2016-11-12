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

        if (user) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            console.log("i encountered an error");
        }

        else {

            // if there is no user with that email
            // create the user
            console.log("im here");
            var newUser            = new User();

            newUser.firstname = req.body.firstname;
            newUser.lastname = req.body.lastname;
            newUser.email = email;
            console.log("passed");
            newUser.password = newUser.generateHash(password);

            newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });

            console.log("entering done")

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
