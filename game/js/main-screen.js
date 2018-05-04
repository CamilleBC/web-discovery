var canvas = document.getElementById("mainScreen");
var ctx = canvas.getContext("2d");

main();

function main() {
	var ball = {
		radius: 10,
		x: (canvas.width/2),
		y: (canvas.height-30),
		draw: function(ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
			ctx.fillStyle = "#0095DD";
			ctx.fill();
			ctx.closePath();
		},
		move: function (dx, dy) {
			this.x += dx;
			this.y += dy;
		},
		isBouncing: function (coordStr, delta) {
			var coord = coordStr == "x" ? this.x : this.y;
			var canvasLimit = coordStr == "x" ? canvas.width : canvas.height;
			var nextCoordinate = coord + delta;
			if (nextCoordinate > (canvasLimit - this.radius)
				|| nextCoordinate < this.radius)
				return true;
			return false;
		}
	}
	setInterval(function() {
		draw(ctx, ball);
	}, 10);
}

var dx = 2;
var dy = -2;
function draw(ctx, ball) {
	ball.draw(ctx);
	if (ball.isBouncing("x", dx))
		dx = -dx;
	if (ball.isBouncing("y", dy))
		dy = -dy;
	ball.move(dx, dy);
}

function bounce() {
}

