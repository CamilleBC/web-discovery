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
	constructor(x, y, radius, stepX, stepY) {
		super(x, y);
		this.radius = radius;
		this.stepX = stepX;
		this.stepY = stepY;
	}
	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
	}
	move() {
		this.x += this.stepX;
		this.y += this.stepY;
	}
	bounceWall() {
		let nextX = this.x + this.stepX;
		let nextY =  this.y + this.stepY;
		let leftWall = canvas.width - this.radius; 
		let ret = false;

		if (nextX > leftWall || nextX < this.radius) {
			this.stepX = -this.stepX;
			ret = true;
		}
		if (nextY < this.radius) { 
			this.stepY = -this.stepY;
			ret = true;
		}
		return ret;
	}
	isOut() {
		let nextY =  this.y + this.stepY;
		if (nextY > (canvas.height - this.radius))
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
}

class Paddle extends Rectangle {
	constructor(x, y, width, height, step) {
		super(x, y, width, height);
		this.step = step;
	}
	input() {
		if (rightPressed) {
			this.move(true, this.step);
		} else if (leftPressed) {
			this.move(false, this.step);
		}
	}
	move(direction) {
		let rightLimit = canvas.width - this.width;
		let leftLimit = 0;

		if (direction === true && this.x < rightLimit) {
			this.x += this.step;
		}
		if (direction === false && this.x > leftLimit) {
			this.x -= this.step;
		}
	}
}

/***************************** Main function **********************************/
main();

function main() {
	let ballX = canvas.width / 2;
	let ballY = canvas.height - 40;
	let paddleW = 75;
	let paddleH = 10;
	let paddleX = (canvas.width - paddleW) / 2;
	let paddleY = canvas.height - 20;
	var ball = new Sphere(ballX, ballY, 10, 2, -2);
	var paddle = new Paddle(paddleX, paddleY, paddleW, paddleH, 7); 
	var bricks = [];
	buildBricks(bricks, 2, 3);
	eventHandler();
	setInterval(function() {
		draw(ctx, ball, paddle, bricks);
	}, 10);
}

/************************* Event handler functions ****************************/
function eventHandler() {
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
}

function keyDownHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = true;
	}
	else if(e.keyCode == 37) {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = false;
	}
	else if(e.keyCode == 37) {
		leftPressed = false;
	}
}

/*************************** Drawing functions ********************************/
function draw(ctx, ball, paddle, bricks) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	paddle.draw(ctx);
	paddle.input();
	if (!ball.bounceWall()) {
		if (!bouncePaddle(ball, paddle)) {
			if (ball.isOut()) {
				alert("GameOver");
				document.location.reload();
			} 
		} 
	}
	drawBricks(bricks,ctx);
	ball.draw(ctx);
	ball.move();
}

function drawBricks(bricks, ctx) {
	bricks.forEach( function(column) {
		column.forEach( function(brick) {
			brick.draw(ctx);
		});
	});
}

/**************************** Forms functions *********************************/
// Build bricks by sizing, spacing them depending on the number or col and rows
function buildBricks(bricks, bricksColumns, bricksRows) {
	let wPercent = percentage => (canvas.width / 100) * percentage;
	let hPercent = percentage => (canvas.height / 100) * percentage;
	let padding = wPercent(10) / bricksColumns;
	let w = (wPercent(80) / bricksColumns);
	console.log(w);
	let h = (canvas.height / 100) * bricksRows;
	let offsetTop = hPercent(8);
	let offsetLeft = wPercent(10);


	for (var col = 0; col < bricksColumns; ++col) {
		bricks[col] = [];
		for (let row = 0; row < bricksRows; ++row) {
			let x = (col * (w + padding)) + offsetLeft;
			let y = (row * (h + padding)) + offsetTop;
			bricks[col][row] = new Rectangle(x, y, w, h);
		}
	}
}

function slowDown(ball) {
	if (Math.abs(ball.stepY) > 2) {
		ball.stepY /= 1.1;
		ball.stepX /= 1.1;
		setTimeout(slowDown, 100, ball);
	} else if (ball.stepY <= 0) {
		ball.stepY = -2;
	} else {
		ball.stepX = 2;
	}
}

function bouncePaddle(ball, paddle) {
	let ballRight = ball.x + ball.radius;
	let ballBottom = ball.y + ball.radius;
	let paddleRight = paddle.x + paddle.width;
	let ballOnPaddle = paddle.y - ball.radius ;

	if ((ball.x > paddle.x && ball.x < paddleRight)
		&& (ballBottom >= paddle.y)) {
		if (ballBottom > paddle.y) {
			ball.y = ballOnPaddle;
		}
		ball.stepY = -ball.stepY * 2;
		ball.stepX = ball.stepX * 2;
		setTimeout(slowDown, 300, ball);
		return true;
	}
	return false;
}

