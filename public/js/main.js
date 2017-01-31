$(document).ready(function() {
  console.log("JS online");
  /* SOME INITIALIZATION STUFF */
  // var socket = io();
  console.log("canvas:", $('#canvas')[0])
  var ctx = $('#canvas')[0].getContext("2d");

  // players[socketID] = { x: __, y: __, name: __, msg: __, colors: { hair, skin, top, bottom } }
  var players = {}; // list of all connected players and relevant data
  var yourId;

  var bit = 10; // size of one "pixel"
  var yourW = bit*4; // avatar width
  var yourH = yourW*3; // avatar height
  var spawnX = canvas.width/2 - yourW/2; // spawn point
  var spawnY = canvas.height/2 - yourH/2; // spawn point
  var yourGait = bit; // movement increment

/* ------------------------------------------------ SOCKET.IO EVENT LISTENERS */
  socket.on('connect', function() {
    // emit socket session ID, initial coordinates (spawn point),
    // and other user data (display name, avatar appearance/colors)
    socket.emit('newPlayer', {
      id: socket.id.substring(2, socket.id.length),
      x: spawnX,
      y: spawnY,
      msg: ""
    });
    // make sure emit parameters corresponds with the way back-end socket.io sets it up

    // in the client list, the first two characters of socket IDs are cut off
    yourId = socket.id.substring(2, socket.id.length);

    socket.emit('readyForPlayers');
    console.log(yourId, spawnX, spawnY, "");
  });

  socket.on('givePlayersList', function(playerList) {
    for (var i=0; i<playerList.length; i++) {
      var id = playerList[i].substring(2, playerList[i].length);
      if (id !== socket.id) {
        addPlayer(id, spawnX, spawnY, ""); // CHANGE X AND Y TO 'CURRENT' COORDINATES OF EACH PLAYER
      }
    }
    console.log("givePlayersList:", players);
    redrawCanvas();
  });

  socket.on('newPlayer', function(newPlayer) {
    addPlayer(newPlayer.id, newPlayer.x, newPlayer.y, 40)
  });

  socket.on('movement', function(data) {
    players[data.id].x = data.x;
    players[data.id].y = data.y;
  });

  socket.on('chat message', function(data){
    players[data.id].msg = data.msg;
    console.log('chat message:', players[data.id].msg)
  });

  avatar(spawnX, spawnY, yourW, 40);

  $(document).keydown(function(event) {
    arrowKeyDown(event);
    socket.emit('movement', {
      id: yourId,
      x: players[yourId].x,
      y: players[yourId].y,
    });
    redrawCanvas();
  });

/* ---------------------------------------------- DATA MANIPULATION FUNCTIONS */

  function addPlayer(playerId, x, y, msg) {
    players[playerId] = {
      x: x,
      y: y,
      msg: msg
    }
  }

  function arrowKeyDown(event) {
    console.log("key pressed:", event.keyCode);
    var keyCode = event.keyCode;
    if (keyCode >= 37 && keyCode <= 40) { // ONLY ARROW KEYS MODIFY YOUR COORDINATES
      switch(keyCode) {
        case 37: // left arrow: keyCode 37
          if (players[yourId].x > 0) {
            players[yourId].x -= yourGait;
          }
          break;
        case 38: // up arrow: keyCode 38
          if (players[yourId].y > 0) {
            players[yourId].y -= yourGait;
          }
          break;
        case 39: // right arrow: keyCode 39
          if (players[yourId].x+yourW < canvas.width) {
            players[yourId].x += yourGait;
          }
          break;
        case 40: // down arrow: keyCode 40
          if (players[yourId].y+yourH < canvas.height) {
            players[yourId].y += yourGait;
          }
          break;
      }
    }
  }

/* -------------------------------------------- CANVAS MANIPULATION FUNCTIONS */
// RENDER EVERY PLAYER'S AVATAR
  function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clears the entire canvas
    for (var id in players) {
      avatar(players[id].x, players[id].y, yourW, 40, players[id].msg);
      console.log(players[id].msg)
    }

    console.log(players);

    ctx.fillStyle = "red";
    ctx.font = "20px Silkscreen";
    ctx.fillText("x: " + players[yourId].x + " y: " + players[yourId].y ,10,50);
  }

// DRAW BASIC RECTANGLES
  function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x,y,w,h);
    ctx.closePath();
    ctx.fill();
  }

// DRAW FULL AVATARS
  function avatar(x, y, w, keyCode, msg) {
    ctx.fillStyle = 'chocolate'; // skin
    rect(x, y, w, w);
    ctx.fillStyle = 'red'; // top
    rect(x, y+w, w, w);
    ctx.fillStyle = 'blue'; // bottom
    rect(x, y+(w*2), w, w);
    ctx.fillStyle = 'black'; // hair
    rect(x, y, w, w/4);

    if (keyCode) {
      ctx.fillStyle = 'black'; // eyes
      if (keyCode === 37) { // facing left
        rect(x, y+(w/2), w/4, w/4);
        rect(x+(w/2), y+(w/2), w/4, w/4);
      } else if (keyCode === 39) { // facing right
        rect(x+(w/4), y+(w/2), w/4, w/4);
        rect(x+3*(w/4), y+(w/2), w/4, w/4);
      } else if (keyCode === 40) { // facing down/forward
        rect(x, y+(w/2), w/4, w/4);
        rect(x+3*(w/4), y+(w/2), w/4, w/4);
      }
    }

    if (msg !== "" && msg !== undefined) { // if message is not empty
      wrapText(msg, x+w, y, 200, 15); // also render message
    }

  }

// DRAW TEXT
  function wrapText(text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

});
