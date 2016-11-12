var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


/*var monthly_expense = mongoose.Schema({

  year: Number,
  rent: Number,
  bills: Number,
  transportation: Number,

});*/


var userSchema = mongoose.Schema({

        firstname    : String,
        lastname     : String,
        email        : String,
        password     : String

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
