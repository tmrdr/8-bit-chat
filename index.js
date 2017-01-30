require('dotenv').config();
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var request = require('request');
var session = require('express-session');
var flash = require('connect-flash');
// var isLoggedIn = require('./middleware/isLoggedIn');
var app = express();
// var db = require("./models");
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));


app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretpassword',
    resave: false,
    saveUninitialized: true
}));


// app.use(flash());
//
// app.use(function(req, res, next) {
//     res.locals.alerts = req.flash();
//     res.locals.currentUser = req.user;
//     next();
// });

// });

//auth here


var server = app.listen(process.env.PORT || 3000);

module.exports = server;
