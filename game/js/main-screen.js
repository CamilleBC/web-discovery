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
}

class Ball extends Sphere {
	constructor(x, y, radius, stepX, stepY) {
		super(x, y, radius);
		this.stepX = stepX;
		this.stepY = stepY;
		this.slowDown = this.slowDown.bind(this);
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
	move() {
		this.x += this.stepX;
		this.y += this.stepY;
	}
	slowDown() {
		if (Math.abs(this.stepY) > 2) {
			this.stepY /= 1.1;
			this.stepX /= 1.1;
			setTimeout(this.slowDown, 100);
		} else if (this.stepY <= 0) {
			this.stepY = -2;
		} else {
			this.stepX = 2;
		}
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

class Brick extends Rectangle {
	constructor(x, y, width, height, isVisible) {
		super(x, y, width, height);
		this.isVisible = isVisible;
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
	var ball = new Ball(ballX, ballY, 10, 3, -3);
	var paddle = new Paddle(paddleX, paddleY, paddleW, paddleH, 7); 
	var bricks = [];
	buildBricks(bricks, 5, 4);
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
	collisionDetection(ball, bricks);
	drawBricks(bricks,ctx);
	ball.draw(ctx);
	ball.move();
}

function drawBricks(bricks, ctx) {
	bricks.forEach( function(column) {
		column.forEach( function(brick) {
			if (brick.isVisible) {
				brick.draw(ctx);
			}
		});
	});
}

/**************************** Forms functions *********************************/
// Build bricks by sizing, spacing them depending on the number or col and rows
function buildBricks(bricks, bricksColumns, bricksRows) {
	let wPercent = percentage => (canvas.width / 100) * percentage;
	let hPercent = percentage => (canvas.height / 100) * percentage;
	let paddingCol = wPercent(10) / bricksColumns;
	let paddingRow = wPercent(6) / bricksRows;
	let w = (canvas.width / bricksColumns) - paddingCol;
	let h = hPercent(20) / bricksRows;

	for (var col = 0; col < bricksColumns; ++col) {
		bricks[col] = [];
		for (let row = 0; row < bricksRows; ++row) {
			let x = (col * (w + (paddingCol / 2))) + paddingCol / 2;
			let y = (row * (h + (paddingRow / 2))) + paddingRow / 2;
			bricks[col][row] = new Brick(x, y, w, h, true);
		}
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
		ball.slowDown();
		return true;
	}
	return false;
}

function collisionDetection(ball, bricks) {
	bricks.forEach( function(column) {
		column.forEach( function(brick) {
			if (brick.isVisible) {
				let ballRight = ball.x + ball.radius;
				let ballTop = ball.y - ball.radius;
				let brickBottom = brick.y + brick.height;
				let brickRight = brick.x + brick.width;
				let ballOnBrick = brickBottom + ball.radius ;

				if ((ball.x > brick.x && ball.x < brickRight)
					&& (ballTop <= brickBottom)) {
					if (ballTop < brickBottom) {
						ball.y = ballOnBrick;
					}
					ball.stepY = -ball.stepY;
					brick.isVisible = false;
				}
			}
		});
	});
}
