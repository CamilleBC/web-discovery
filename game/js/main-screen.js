var canvas = document.getElementById("mainScreen");
var ctx = canvas.getContext("2d");
var rightPressed = false;
var leftPressed = false;

class Form {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Sphere extends Form {
	constructor(x, y, radius) {
		super(x, y);
		this.radius = radius;
	}
	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
	}
	move(dx, dy) {
		this.x += dx;
		this.y += dy;
	}
	isBouncing(coordStr, delta) {
		var coord = coordStr === "x" ? this.x : this.y;
		var canvasLimit = coordStr === "x" ? canvas.width : canvas.height;
		var nextCoordinate = coord + delta;
		if (nextCoordinate > (canvasLimit - this.radius)
			|| nextCoordinate < this.radius)
			return true;
		return false;
	}
}

class Rectangle extends Form {
	constructor(x, y, width, height) {
		super(x, y);
		this.width = width;
		this.height = height;
	}
	draw(ctx) {
		ctx.beginPath();
		ctx.fillStyle = "#0095AD";
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.closePath();
	}
	move(direction, step) {
		var rightLimit = canvas.width - this.width;
		var leftLimit = 0;
		console.log("IN PADDLE");
		if (direction === true && this.x < rightLimit) {
			this.x += step;
			console.log("X Paddle: " + this.x);
		}
		if (direction === false && this.x > leftLimit) {
			this.x -= step;
			console.log("RIGHT PADDLE");
		}
	}
}

main();

function eventHandler() {
}

function keyDownHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = true;
		console.log("Right true");
	}
	else if(e.keyCode == 37) {
		leftPressed = true;
		console.log("Left true");
	}
}

function keyUpHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = false;
		console.log("Right false");
	}
	else if(e.keyCode == 37) {
		leftPressed = false;
		console.log("Left false");
	}
}

var dx = 2;
var dy = -2;
function draw(ctx, ball, paddle) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	paddle.draw(ctx);
	if (rightPressed) {
		paddle.move(true, 7);
		console.log("Right move");
	} else if (leftPressed) {
		paddle.move(false, 7);
		console.log("Left move");
	}
	ball.draw(ctx);
	if (ball.isBouncing("x", dx))
		dx = -dx;
	if (ball.isBouncing("y", dy))
		dy = -dy;
	ball.move(dx, dy);
}

function main() {
	var ball = new Sphere(canvas.width/2, canvas.height-30, 10);
	var width = 75;
	var paddle = new Rectangle((canvas.width-width)/2, canvas.height-20, width, 10); 
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	setInterval(function() {
		draw(ctx, ball, paddle);
	}, 10);
}



