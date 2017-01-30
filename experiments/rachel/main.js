$(document).ready(function() {
  var ctx = $('#canvas')[0].getContext("2d");

  var youX = 0;
  var youY = 0;
  var youW = 10;
  var youH = 10;
  var youSpeed = 10;

  function rect(x,y,w,h) {
    ctx.beginPath();
    ctx.rect(x,y,w,h);
    ctx.closePath();
    ctx.fill();
  }

  $(document).keydown(function(event) {
    // console.log( ".keydown() code:", event.keyCode );
    var keyCode = event.keyCode;

    // ctx.clearRect(youX, youY, 10, 10); // clears just the rectangle but not the text
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clears the entire canvas

    switch(keyCode) {
      case 37: // left arrow: keyCode 37
      if (youX > 0) {
        youX -= youSpeed;
      }
        break;
      case 38: // up arrow: keyCode 38
      if (youY > 0) {
        youY -= youSpeed;
      }
        break;
      case 39: // right arrow: keyCode 39
      if (youX+youW < canvas.width) {
        youX += youSpeed;
      }
        break;
      case 40: // down arrow: keyCode 40
      if (youY+youH < canvas.height) {
        youY += youSpeed;
      }
        break;
    }

    ctx.fillStyle = "blue";
    rect(youX, youY, 10, 10);

    ctx.fillStyle = "red";
    ctx.font = "20px Silkscreen";
    ctx.fillText("x: " + youX + " y: " + youY ,10,50);

  });

});
