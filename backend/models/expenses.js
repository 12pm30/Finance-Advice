var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var expenseSchema = mongoose.Schema({

        user_id    : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        monthly: {
          rent: Number,
          bills: Number,
          transportation: Number,
        },
        yearly: {
          tuition: Number,
          debt: Number
        }
        }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Expenses', expenseSchema);
