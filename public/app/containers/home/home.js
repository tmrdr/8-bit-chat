angular.module('ChatApp')
.component('homeComp', {
  templateUrl: 'app/containers/home/home.html',
  controller: HomeCompCtrl,
  controllerAs: 'homeComp'
});

function HomeCompCtrl() {

  this.$onInit = function () {
  /* ---------------------------------------------- SOME INITIALIZATION STUFF */
    console.log("home.js online");
    var socket = io();
    var ctx = $('#canvas')[0].getContext("2d");

    // players[socketID] = { x: __, y: __, facing: __, msg: __, colors: { hair, skin, top, bottom } }
    var players = {}; // list of all connected players and relevant data
    var yourId;

    var bit = 5; // size of one "pixel"
    var yourW = bit*4; // avatar width
    var yourH = yourW*3; // avatar height
    var spawnX = canvas.width/2 - yourW/2; // spawn point
    var spawnY = canvas.height/2 - yourH/2; // spawn point
    var spawnFacing = 40;
    var yourGait = bit; // player state increment

  /* ---------------------------------------------- SOCKET.IO EVENT LISTENERS */
    socket.on('connect', function() {
      console.log('connected to socket', socket);
      // in the client list, the first two characters of socket IDs are cut off
      yourId = socket.id.substring(2, socket.id.length);
      addPlayer(yourId, spawnX, spawnY, spawnFacing, "")

      socket.emit('newPlayer', {
        id: yourId,
        x: spawnX,
        y: spawnY,
        facing: spawnFacing,
        msg: ""
      });
      // make sure emit parameters corresponds with the way back-end socket.io sets it up

      socket.emit('readyForPlayers');
      console.log('player ready:', yourId, players[yourId]);
    });

    socket.on('givePlayersList', function(playerList) {
      console.log('givePlayersList event:', playerList)
      for (var i=0; i<playerList.length; i++) {
        var id = playerList[i].substring(2, playerList[i].length);
        if (id !== socket.id) {
          addPlayer(id, spawnX, spawnY, spawnFacing, "");
        }
      }
      console.log("givePlayersList:", players);
      redrawCanvas();
    });

    socket.on('newPlayer', function(newPlayer) { // did a new player join?
      console.log('newPlayer event:', newPlayer);
      addPlayer(newPlayer.id, newPlayer.x, newPlayer.y, newPlayer.facing, "");

      // send them your player state so they can render it
      emitYourState();
      redrawCanvas();
    });

    socket.on('player state', function(data) {
      // console.log('player state event:', data);
      if (!players[data.id]) { // if the player isn't on your player list, add them
        addPlayer(data.id, data.x, data.y, data.facing, data.msg);
      } else { // if they are on your player list, update their state
        updatePlayer(data.id, data.x, data.y, data.facing, data.msg);
      }
      redrawCanvas();
    });

    socket.on('chat message', function(data) {
      // console.log("chat data:", data);
      players[data.id].msg = data.msg;

      var p = document.createElement('p');
      p.innerText = data.msg;
      document.getElementById('messages').appendChild(p);

      redrawCanvas();
    });

    socket.on('disconnect', function(player) {
      console.log('disconnected:', player.id);
      delete players[player.id];
      console.log(players)
      redrawCanvas();
    });

  /* ---------------------------------------- STREAMLINED SOCKET.IO FUNCTIONS */
    function emitYourState() {
      socket.emit('player state', {
        id: yourId,
        x: players[yourId].x,
        y: players[yourId].y,
        facing: players[yourId].facing,
        msg: players[yourId].msg
      });
    }

  /* ------------------------------------------- ELEMENT/DOCUMENT EVENT STUFF */
    window.onbeforeunload = function(e) {
      socket.disconnect();
    };

    $(window).on('hashchange', function(e){
      socket.disconnect();
    });

    $(document).keydown(function(event) {
      if (event.keyCode >= 37 && event.keyCode <= 40){
        event.preventDefault();
        arrowKeyDown(event.keyCode);
        emitYourState();
        redrawCanvas();
      }
    });

    $('#chat-form').on('submit', function(event){
      event.preventDefault();

      var message = event.target.chat.value;
      socket.emit('chat message', {
        id: yourId, // in the client list, the first two characters of socket IDs are cut off
        msg: message
      });

      event.target.chat.value = '';

      setTimeout(function() {
        socket.emit('chat message', {
          id: yourId,
          msg: ''
        });
      }, message.length*1000);

    });

  /* ------------------------------------ PLAYER STATE MANIPULATION FUNCTIONS */

    function addPlayer(id, x, y, keyCode, msg) {
      if (!players[id]) {
        players[id] = {
          x: x,
          y: y,
          facing: keyCode,
          msg: msg
        }
      }
    }

    function updatePlayer(id, x, y, facing, msg) {
      if (players[id]) {
        players[id].x = x;
        players[id].y = y;
        players[id].facing = facing;
        players[id].msg = msg;
      }
    }

    function arrowKeyDown(keyCode) {
      if (keyCode >= 37 && keyCode <= 40) { // ONLY ARROW KEYS MODIFY YOUR COORDINATES
        players[yourId].facing = keyCode;
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

  /* ------------------------------------------ CANVAS MANIPULATION FUNCTIONS */
    // RENDER EVERY PLAYER'S AVATAR
    function redrawCanvas() {
      // console.log(players);
      ctx.clearRect(0, 0, canvas.width, canvas.height); // clears the entire canvas
      var playerRenderOrder = []; // avatars are to be layered according to their y coordinate
      // for (var id in players) {
      //   avatar(players[id].x, players[id].y, yourW, players[id].facing, players[id].msg);
      // }
      // console.log(Object.keys(players));
      // console.log(Object.keys(players).sort(function(a,b){return players[a].y-players[b].y}));
      playerRenderOrder = Object.keys(players).sort(function(a,b){return players[a].y-players[b].y});
      playerRenderOrder.forEach(function(id) {
        avatar(players[id].x, players[id].y, yourW, players[id].facing, players[id].msg);
      });

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
  };

  this.$onDestroy = function () {
    socket.io.disconnect();
    $("#chat-container").empty();
    players = null;
    yourId = null;
  };

}

HomeCompCtrl.$inject = [];
