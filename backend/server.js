var express = require('express');
var app = express();
var port  = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var ejs = require('ejs');
var engine = require('ejs-mate');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var configDB = require('../config/database.js');

//mongoose.connect(configDB.url); // connect to our database

// set up our express application
app.use(express.static(__dirname + '/../frontend/public'));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', '../frontend/views');

// required for passport
app.use(session({ secret: 'secret code' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes/routes.js')(app); // load our routes and pass in our app and fully configured passport

app.listen(port, function (err) {
    if(err) throw err;
    console.log("Server is running on port " + port);
});
