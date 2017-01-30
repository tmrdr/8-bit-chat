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
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, 'public/index.html'));
})


//socket
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('chat message', function(msg){
  io.emit('chat message', msg);
});

  socket.on('disconnect', function(){
    console.log('disconnected user');
  });
});



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

http.listen(3000);

// var server = app.listen(process.env.PORT || 3000);
//
// module.exports = server;
