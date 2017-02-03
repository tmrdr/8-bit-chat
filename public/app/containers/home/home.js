angular.module('ChatApp')
.component('homeComp', {
  templateUrl: 'app/containers/home/home.html',
  controller: HomeCompCtrl,
  controllerAs: 'homeComp'
});

function HomeCompCtrl(Auth, UserService) {
  var homeComp = this;
  console.log(Auth.getToken())
  homeComp.IsLoggedIn = Auth.getToken();

  var socket = io();

  var yourColors = { // default colors
    hair: 'black',
    skin: '#d2691e',
    torso: 'red',
    legs: 'blue'
  };

  if(Auth.currentUser()) {
    UserService.getColors().then(function success(res) {
      homeComp.userSettings = res.data;
      console.log(homeComp.userSettings);
      yourColors = {
        hair: homeComp.userSettings.hairColor,
        skin: homeComp.userSettings.topColor,
        torso: homeComp.userSettings.torsoColor,
        legs: homeComp.userSettings.legsColor
      }
      // homeComp.$onInit();
    }, function error(res) {
      console.log(res);
    });
  }

  homeComp.$onInit = function () {
/* ---------------------------- CHAT FUNCTIONALITY -------------------------- */
  /* ---------------------------------------------- SOME INITIALIZATION STUFF */
    var ctx = $('#canvas')[0].getContext("2d");
    // players[socketID] = { x: __, y: __, facing: __, msg: __, colors: { hair: "#FFFFFF", skin: "#D2691E", torso: "#FF0000", legs: "#0000FF" } }
    var players = {}; // list of all connected players and relevant data
    var yourId;
    var bit = 5; // size of one "pixel"
    var fontSize = bit*3;
    var messageTimeout;
    var yourW = bit*4; // avatar width
    var yourH = yourW*3; // avatar height
    var spawnPosition = {
      x: canvas.width/2 - yourW/2,
      y: canvas.height/2 - yourH/2
    }
    var spawnFacing = 40;
    // var yourColors = {
    //   hair: homeComp.userSettings.hairColor,
    //   skin: homeComp.userSettings.topColor,
    //   torso: homeComp.userSettings.torsoColor,
    //   legs: homeComp.userSettings.legsColor
    // }
    console.log('yourColors:', yourColors);
    var yourGait = bit; // player data increment

  /* ---------------------------------------------- SOCKET.IO EVENT LISTENERS */
    socket.on('connect', function() {
      console.log('connected to socket', socket);
      // in the client list, the first two characters of socket IDs are cut off
      yourId = socket.id.substring(2, socket.id.length);
      addPlayer(yourId, spawnPosition, spawnFacing, "", yourColors);

      socket.emit('newPlayer', {
        id: yourId,
        pos: {
          x: spawnPosition.x,
          y: spawnPosition.y
        },
        facing: spawnFacing,
        msg: "",
        colors: yourColors
      });

      // make sure emit parameters corresponds with the way back-end socket.io sets it up

      socket.emit('readyForPlayers');
      // console.log('player ready:', yourId, players[yourId]);
    });

    socket.on('givePlayersList', function(playerList) {
      // console.log('givePlayersList event:', playerList)
      for (var i=0; i<playerList.length; i++) {
        var id = playerList[i].substring(2, playerList[i].length);
        if (id !== socket.id) {
          addPlayer(id, spawnPosition, spawnFacing, "", yourColors);
        }
      }
      // console.log("givePlayersList:", players);
      redrawCanvas();
    });

    socket.on('newPlayer', function(newPlayer) { // did a new player join?
      // console.log('newPlayer event:', newPlayer);
      addPlayer(newPlayer.id, newPlayer.pos, newPlayer.facing, "", newPlayer.colors);

      // send them your player data so they can render it
      emitYourData();
      redrawCanvas();
    });

    socket.on('player data', function(data) {
      // console.log('player data event:', data);
      if (!players[data.id]) { // if the player isn't on your player list, add them
        addPlayer(data.id, data.pos, data.facing, data.msg, data.colors);
      } else { // if they are on your player list, update their state
        updatePlayer(data.id, data.pos, data.facing, data.msg, data.colors);
      }
      redrawCanvas();
    });

    socket.on('movement', function(data) {
      console.log(data);
      updatePlayer(data.id, data.pos, data.facing);
      redrawCanvas();
    })

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
      // console.log(players)
      redrawCanvas();
    });

  /* ---------------------------------------- STREAMLINED SOCKET.IO FUNCTIONS */
    function emitYourData() {
      socket.emit('player data', {
        id: yourId,
        pos: players[yourId].pos,
        facing: players[yourId].facing,
        msg: players[yourId].msg,
        colors: players[yourId].colors
      });
    }

    function emitYourMovement() {
      socket.emit('movement', {
        id: yourId,
        pos: players[yourId].pos,
        facing: players[yourId].facing,
      });
    }

  /* ------------------------------------------- ELEMENT/DOCUMENT EVENT STUFF */
    $(document).keydown(function(event) {
      if (event.keyCode >= 37 && event.keyCode <= 40){
        event.preventDefault();
        arrowKeyDown(event.keyCode);
        emitYourMovement();
        // console.log(players)
        redrawCanvas();
      }
    });

    homeComp.chatSubmit = function() {
      clearTimeout(messageTimeout);

      var message = event.target.chat.value;
      socket.emit('chat message', {
        id: yourId,
        msg: message
      });

      event.target.chat.value = ''; // clear message from text input

      // clear message from canvas after a timeout
      messageTimeout = setTimeout(function() {
        socket.emit('chat message', {
          id: yourId,
          msg: ''
        });
      }, message.length*1000);
    }

  /* ------------------------------------ PLAYER STATE MANIPULATION FUNCTIONS */
    function addPlayer(id, pos, keyCode, msg, colors) {
      if (!players[id]) {
        players[id] = {
          pos: {
            x: pos.x,
            y: pos.y
          },
          facing: keyCode,
          msg: msg,
          colors: colors
        }
      }
    }

    function updatePlayer(id, pos, facing, msg, colors) {
      if (players[id]) {
        players[id].pos.x = pos.x;
        players[id].pos.y = pos.y;
        players[id].facing = facing;
        if(msg) {
          players[id].msg = msg;
        }
        if(colors) {
          players[id].colors = colors;
        }
      }
    }

    function arrowKeyDown(keyCode) {
      if (keyCode >= 37 && keyCode <= 40) { // ONLY ARROW KEYS MODIFY YOUR COORDINATES
        players[yourId].facing = keyCode;
        switch(keyCode) {
          case 37: // left arrow: keyCode 37
            if (players[yourId].pos.x > 0) {
              players[yourId].pos.x -= yourGait;
            }
            break;
          case 38: // up arrow: keyCode 38
            if (players[yourId].pos.y > 0) {
              players[yourId].pos.y -= yourGait;
            }
            break;
          case 39: // right arrow: keyCode 39
            if (players[yourId].pos.x+yourW < canvas.width) {
              players[yourId].pos.x += yourGait;
            }
            break;
          case 40: // down arrow: keyCode 40
            if (players[yourId].pos.y+yourH < canvas.height) {
              players[yourId].pos.y += yourGait;
            }
            break;
        }
      }
    }

  /* ------------------------------------------ CANVAS MANIPULATION FUNCTIONS */
    function redrawCanvas() { // RENDER EVERY ASSET / PLAYER'S AVATAR
      if($('#canvas')[0]) { // run only if the canvas element exists
        // console.log(players);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // clears the entire canvas
        var assetRenderOrder = []; // avatars are to be layered according to their y coordinate
        assetRenderOrder = Object.keys(players).sort(function(a,b){return players[a].pos.y-players[b].pos.y});
        assetRenderOrder.forEach(function(id) {
          avatar(players[id].pos.x, players[id].pos.y, yourW, players[id].facing, players[id].msg, players[id].colors);
        });

        ctx.fillStyle = "red";
        // ctx.font = "10px Silkscreen";
        // ctx.fillText("x: " + players[yourId].pos.x + " y: " + players[yourId].pos.y ,10,50);
      }
    }

    function rect(x, y, w, h) { // DRAW BASIC RECTANGLES
      ctx.beginPath();
      ctx.rect(x,y,w,h);
      ctx.closePath();
      ctx.fill();
    }

    function avatar(x, y, w, keyCode, msg, colors) { // DRAW FULL AVATARS
      ctx.fillStyle = colors.skin; // skin
      rect(x, y, w, w);
      ctx.fillStyle = colors.torso; // torso
      rect(x, y+w, w, w);
      ctx.fillStyle = colors.legs; // legs
      rect(x, y+(w*2), w, w);
      ctx.fillStyle = colors.hair; // hair
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
        // wrapText(msg, x+w, y, 100, fontSize); // render message
        speechBubble(msg, x+w, y, 100, fontSize);
      }

    }

    function speechBubble(text, x, y, maxWidth, lineHeight) {
      ctx.font = fontSize + "px Silkscreen";
      var words = text.split(' '),
          line = '',
          lineCount = 0,
          test,
          metrics;

      var bubbleW, bubbleH, bubbleX, bubbleY;
      var marginW = 2*bit,
          marginH = bit;
      var maxMetricsW = 0;

      metrics = ctx.measureText(text);

        for (var i = 0; i < words.length; i++) {
          test = words[i];
          metrics = ctx.measureText(test);
          while (metrics.width > maxWidth) {
            // Determine how much of the word will fit
            test = test.substring(0, test.length - 1);
            metrics = ctx.measureText(test);
          }
          if (words[i] != test) {
            words.splice(i + 1, 0,  words[i].substr(test.length))
            words[i] = test;
          }
          if (metrics.width > maxMetricsW) {
            maxMetricsW = metrics.width;
          }
          test = line + words[i] + ' ';
          metrics = ctx.measureText(test);

          if (metrics.width > maxWidth && i > 0) {
            line = words[i] + ' ';
            lineCount++;
          } else {
            line = test;
          }
        }
        lineCount++;
        bubbleW = maxMetricsW + marginW;
        bubbleH = lineCount * lineHeight + marginH;


      bubbleX = x - bubbleW/2 - yourW/2;
      bubbleY = y - bubbleH - bit;

      ctx.fillStyle = "white";
      rect(bubbleX, bubbleY, bubbleW, bubbleH);
      ctx.fillStyle = "#000000";
      ctx.strokeRect(bubbleX, bubbleY, bubbleW, bubbleH);
      wrapText(text, bubbleX+bit, bubbleY+fontSize, maxWidth, fontSize);
    }

    function wrapText(text, x, y, maxWidth, lineHeight) {
      ctx.font = fontSize + "px Silkscreen";
      var words = text.split(' '),
          line = '',
          lineCount = 0,
          test,
          metrics;

      for (var i = 0; i < words.length; i++) {
          test = words[i];
          metrics = ctx.measureText(test);
          // console.log(metrics);
          while (metrics.width > maxWidth) {
              // Determine how much of the word will fit
              test = test.substring(0, test.length - 1);
              metrics = ctx.measureText(test);
          }
          if (words[i] != test) {
              words.splice(i + 1, 0,  words[i].substr(test.length))
              words[i] = test;
          }

          test = line + words[i] + ' ';
          metrics = ctx.measureText(test);

          if (metrics.width > maxWidth && i > 0) {
              ctx.fillText(line, x, y);
              line = words[i] + ' ';
              y += lineHeight;
              lineCount++;
          }
          else {
              line = test;
          }
      }
      ctx.fillText(line, x, y);
    }
  };

  homeComp.$onDestroy = function () {
    $("#chat-container").empty();
    socket.disconnect();
  };

}

HomeCompCtrl.$inject = ['Auth', 'UserService'];
