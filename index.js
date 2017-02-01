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
  // console.log(socket.id);
  // console.log('user connected:', socket.client.id);
  // console.log("connected sockets:", Object.keys(io.sockets.sockets));

  socket.on('newPlayer', function(newPlayerData) {
    console.log("new player:", newPlayerData);
    socket.broadcast.emit('newPlayer', {
      id: newPlayerData.id,
      x: newPlayerData.x,
      y: newPlayerData.y,
      facing: newPlayerData.facing,
      msg: newPlayerData.msg
    });
  });

  socket.on('readyForPlayers', function() {
    console.log('readyForPlayers');
    io.of('/').clients(function(error, clients) {
      console.log("givePlayersList:", clients);
      socket.emit('givePlayersList', clients);
    });
  });

  socket.on('player state', function(playerData) {
    console.log('player state:', playerData)
    socket.broadcast.emit('player state', {
      id: playerData.id,
      x: playerData.x,
      y: playerData.y,
      facing: playerData.facing,
      msg: playerData.msg
    });
  })

  socket.on('chat message', function(playerData){
    io.emit('chat message', {
      id: playerData.id,
      msg: playerData.msg
    });
  });

  socket.on('disconnect', function(){ // LATER SET THIS UP TO REMOVE OBJECT FROM PLAYER LIST BY KEY (PLAYER ID)
    console.log('disconnected user:', socket.client.id);
    io.emit('disconnect', {
      id: socket.client.id.substring(2, socket.id.length)
    })
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
