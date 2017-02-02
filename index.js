require('dotenv').config();
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var request = require('request');
var session = require('express-session');
var flash = require('connect-flash');

// JSON web token dependencies, including a secret key to sign the token
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var secret = process.env.JWT_SECRET;

var app = express();

// mongoose models and connection
var mongoose = require('mongoose');
var User = require('./models/user');
mongoose.connect('mongodb://localhost/chat');

var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(require('morgan')('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// decode POST data in JSON and URL encoded formats
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// AUTH HERE
app.use('/users', require('./controllers/users'));

app.use('/api/users', expressJWT({secret: secret}).unless({
  path: [{ url: '/api/users', methods: ['POST'] }]
}), require('./controllers/users'));


// this middleware will check if expressJWT did not authorize the user, and return a message
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({ message: 'You need an authorization token to view this information.' });
  }
});

// POST /api/auth - if authenticated, return a signed JWT
app.post('/api/auth', function(req, res) {
  User.findOne({ name: req.body.name }, function(err, user) {
    // return 401 if error or no user
    if (err || !user) return res.status(401).send({ message: 'User not found' });

    // attempt to authenticate a user
    var isAuthenticated = user.authenticated(req.body.password);
    // return 401 if invalid password or error
    if (err || !isAuthenticated) return res.status(401).send({ message: 'User not authenticated' });

    // sign the JWT with the user payload and secret, then return
    var token = jwt.sign(user.toJSON(), secret);

    return res.send({ user: user, token: token });
  });
});


app.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, 'public/index.html'));
})


// socket
io.on('connection', function(socket){
  // console.log('user connected:', socket.client.id);
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
    // console.log('readyForPlayers fired');
    io.of('/').clients(function(error, clients) {
      console.log("givePlayersList:", clients);
      socket.emit('givePlayersList', clients);
    });
  });

  socket.on('player state', function(playerData) {
    // console.log('player state:', playerData)
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


// app.use(flash());
//
// app.use(function(req, res, next) {
//     res.locals.alerts = req.flash();
//     res.locals.currentUser = req.user;
//     next();
// });

// });


// http.listen(3000);

// var server = app.listen(process.env.PORT || 3000);
var server = http.listen(process.env.PORT || 3000)
module.exports = server;
