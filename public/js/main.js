$(document).ready(function() {
  console.log("JS online");
  /* SOME INITIALIZATION STUFF */
  // establish canvas
  var ctx = $('#canvas')[0].getContext("2d");

  // players[socketID] = { x: __, y: __, name: __, message: __, colors: { hair, skin, top, bottom } }
  var players = {}; // list of all connected players and relevant data
  console.log(players);

  var bit = 10; // size of one "pixel"
  var yourW = bit*4; // avatar width
  var yourH = yourW*3; // avatar height
  var yourX = canvas.width/2 - yourW; // spawn point
  var yourY = canvas.height/2 - yourH; // spawn point
  var yourGait = bit; // movement increment

  // connect to socket thing
  socket.on('connect', function() {
    // emit socket session ID, initial coordinates (spawn point),
    // and other user data (display name, avatar appearance/colors)
    socket.emit('newPlayer', {
      id: socket.id,
      x: yourX,
      y: yourY,
      message: ""
    }); // make sure emit parameters corresponds with back-end socket stuff
  });

  // take in initial coordinates and other user data
  socket.on('newPlayer', function(data) {
    addPlayer(data.id, data.x, data.y);
  });

  function addPlayer(playerId, x, y, message) {
    players[playerId] = {
      x: x,
      y: y,
      message: message
    }
    console.log(players);
  }

  // var people = [];
  //
  // socket.on('chat message', function(msg){
  //   people.push(msg);
  //   console.log(people);
  // });

  avatar(yourX, yourY, yourW);

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

    // ctx.fillStyle = "blue";
    // rect(yourX, yourY, yourW, yourH);
    avatar(yourX, yourY, yourW, keyCode);

    ctx.fillStyle = "red";
    ctx.font = "20px Silkscreen";
    ctx.fillText("x: " + yourX + " y: " + yourY ,10,50);
    wrapText(message, yourX+yourW, yourY, 200, 15);


    // people.forEach(function(person) {
    //   avatar(Math.floor(Math.random()*800), Math.floor(Math.random()*300), yourW, keyCode);
    //   wrapText(person, Math.floor(Math.random()*800)+yourW, Math.floor(Math.random()*300), 200, 15);
    // })


  });

});
