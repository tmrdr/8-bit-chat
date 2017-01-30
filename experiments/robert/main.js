var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
// Create gradient

ctx.beginPath();
    ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
    ctx.moveTo(110, 75);
    ctx.arc(75, 75, 35, 0, Math.PI, true);  // Mouth (clockwise)
    ctx.moveTo(65, 65);
    ctx.arc(60, 65, 10, 0, Math.PI * 2, true);  // Left eye
    ctx.moveTo(95, 65);
    ctx.arc(90, 65, 10, 0, Math.PI * 2, true);  // Right eye
    ctx.stroke();
