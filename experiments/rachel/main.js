$(document).ready(function() {

  ctx = $('#canvas')[0].getContext("2d");

  function rect(x,y,w,h) {
    ctx.beginPath();
    ctx.rect(x,y,w,h);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = "blue";

  rect(43, 53, 10, 10);

});
