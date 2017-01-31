$(document).ready(function() {
  console.log("JS online");
  /* SOME INITIALIZATION STUFF */
  // var socket = io();
  var ctx = $('#canvas')[0].getContext("2d");

  // players[socketID] = { x: __, y: __, name: __, msg: __, colors: { hair, skin, top, bottom } }
  var players = {}; // list of all connected players and relevant data
  var yourId;
  var yourMsg = "";
  console.log(players);

  var bit = 10; // size of one "pixel"
  var yourW = bit*4; // avatar width
  var yourH = yourW*3; // avatar height
  var yourX = canvas.width/2 - yourW/2; // spawn point
  var yourY = canvas.height/2 - yourH/2; // spawn point
  var yourGait = bit; // movement increment

  // connect to socket thing
  socket.on('connect', function(data) {
    yourId = socket.id;
    // emit socket session ID, initial coordinates (spawn point),
    // and other user data (display name, avatar appearance/colors)
    socket.emit('newPlayer', {
      id: yourId,
      x: yourX,
      y: yourY,
      msg: yourMsg
    }); // make sure emit parameters corresponds with back-end socket stuff

    console.log(yourId, yourX, yourY, yourMsg);

    // addPlayer(socket.id, yourX, yourY, "");
  });

  // take in that moment's list of players' coordinates and other data
  socket.on('newPlayer', function(data) {
    addPlayer(data.id, data.x, data.y);
  });

  function addPlayer(playerId, x, y, msg) {
    players[playerId] = {
      x: x,
      y: y,
      msg: msg
    }
    console.log(players);
  }

  socket.on('movement', function(peerData) {
    var peer = players[peerData.id];
    peer.x = peerData.x;
    peer.y = peerData.y;
  });

  var people = [];
  //
  socket.on('chat message', function(data){
    var peer = players[data.id]; // does not work for you unless you are added to players list object
    console.log(peer)
    peer.msg = data.msg;
    // people.push({msg});
    // console.log(people);
    console.log(players)
  });

  avatar(yourX, yourY, yourW);

  $(document).keydown(function(event) {
    // console.log( ".keydown() code:", event.keyCode );
    var keyCode = event.keyCode;

    // ctx.clearRect(yourX, yourY, 10, 10); // clears just the rectangle but not the text
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clears the entire canvas

    switch(keyCode) {
      case 37: // left arrow: keyCode 37
        if (yourX > 0) {
          yourX -= yourGait;
        }
        break;
      case 38: // up arrow: keyCode 38
        if (yourY > 0) {
          yourY -= yourGait;
        }
        break;
      case 39: // right arrow: keyCode 39
        if (yourX+yourW < canvas.width) {
          yourX += yourGait;
        }
        break;
      case 40: // down arrow: keyCode 40
        if (yourY+yourH < canvas.height) {
          yourY += yourGait;
        }
        break;
    }

    avatar(yourX, yourY, yourW, keyCode);

    ctx.fillStyle = "red";
    ctx.font = "20px Silkscreen";
    ctx.fillText("x: " + yourX + " y: " + yourY ,10,50);
    wrapText(yourMsg, yourX+yourW, yourY, 200, 15);

    // people.forEach(function(person) {
    //   avatar(Math.floor(Math.random()*800), Math.floor(Math.random()*300), yourW, keyCode);
    //   wrapText(person, Math.floor(Math.random()*800)+yourW, Math.floor(Math.random()*300), 200, 15);
    // })

  });

  console.log(players);

  function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x,y,w,h);
    ctx.closePath();
    ctx.fill();
  }

  function avatar(x, y, w, keyCode) {
    ctx.fillStyle = 'chocolate';
    rect(x, y, w, w);
    ctx.fillStyle = 'red';
    rect(x, y+w, w, w);
    ctx.fillStyle = 'blue';
    rect(x, y+(w*2), w, w);
    ctx.fillStyle = 'black';
    rect(x, y, w, w/4);

    ctx.fillStyle = 'black';
    if (keyCode === 37) {
      rect(x, y+(w/2), w/4, w/4);
      rect(x+(w/2), y+(w/2), w/4, w/4);
    } else if (keyCode === 39) {
      rect(x+(w/4), y+(w/2), w/4, w/4);
      rect(x+3*(w/4), y+(w/2), w/4, w/4);
    } else if (keyCode === 40) {
      rect(x, y+(w/2), w/4, w/4);
      rect(x+3*(w/4), y+(w/2), w/4, w/4);
    }

  }

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
