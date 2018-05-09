var canvas = document.getElementById('mainScreen');
var ctx = canvas.getContext('2d');
var rightPressed1 = false;
var leftPressed1 = false;
var rightPressed2 = false;
var leftPressed2 = false;

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
		ctx.fillStyle = '#0095DD';
		ctx.fill();
		ctx.closePath();
	}
}

class Ball extends Sphere {
	constructor(x, y, radius, stepX, stepY) {
		super(x, y, radius);
		this.stepX = stepX;
		this.stepY = stepY;
		this.baseX = stepX;
		this.baseY = stepY;
		this.slowDown = this.slowDown.bind(this);
		this.ownerId = 1;
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
		let absBaseY = Math.abs(this.baseY);
		let absStepY = Math.abs(this.stepY);

		if (absStepY > absBaseY) {
			this.stepY /= 1.1;
			this.stepX /= 1.1;
			setTimeout(this.slowDown, 100);
		} else if (this.stepY <= 0) {
			this.stepY = -absBaseY;
		} else {
			this.stepY = absBaseY;
		}
	}
}

class Rectangle extends Form {
	constructor(x, y, width, height) {
		super(x, y);
		this.width = width;
		this.height = height;
	}
	draw(ctx, colour) {
		ctx.beginPath();
		ctx.fillStyle = colour;
		ctx.globalAlpha = 0.5;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.globalAlpha = 1.0;
		ctx.closePath();
	}
}

class Paddle extends Rectangle {
	constructor(x, y, width, height, step, id) {
		super(x, y, width, height);
		this.id = id;
		this.step = step;
		this.inputSet = { right: false, left: false };
		this.colour = 'red';
	}
	defineColour() {
			switch (this.id) {
				case 1:
					this.colour = 'red';
					break;
				case 2:
					this.colour = 'blue';
					break;
				case 3:
					this.colour = 'green';
					break;
				case 4:
					this.colour = 'yellow';
					break;
			}
	}
	eventListener() {
		document.addEventListener('keydown', 
			this.keyDownHandler.bind(this), false);
		document.addEventListener('keyup', 
			this.keyUpHandler.bind(this), false);
	}
	keyDownHandler(e) {
		if (this.id === 1) {
			if(e.keyCode == 39) {
				this.inputSet.right = true;
			} else if(e.keyCode == 37) {
				this.inputSet.left = true;
			}
		} else if (this.id === 2) {
			if(e.keyCode == 68) {
				this.inputSet.right = true;
			} else if(e.keyCode == 65) {
				this.inputSet.left = true;
			}
		}
	}
	keyUpHandler(e) {
		if (this.id === 1) {
			if(e.keyCode == 39) {
				this.inputSet.right = false;
			} else if(e.keyCode == 37) {
				this.inputSet.left = false;
			}
		} else if (this.id === 2) {
			if(e.keyCode == 68) {
				this.inputSet.right = false;
			} else if(e.keyCode == 65) {
				this.inputSet.left = false;
			}
		}
	}
	move() {
		let rightLimit = canvas.width - this.width;
		let leftLimit = 0;

		if (this.inputSet.right === true && this.x < rightLimit) {
			this.x += this.step;
		}
		if (this.inputSet.left === true && this.x > leftLimit) {
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
	var ball = defineBall();
	var paddles = definePaddles();
	var players = definePlayers();
	var bricks = [];
	const topScore = highscore(players[0].name);

	createScoreHtml(topScore, players);
	buildBricks(bricks, 5, 4);
	paddles.forEach ( (paddle) => {
		paddle.eventListener();
	});
	setInterval(function() {
		draw(ctx, ball, paddles, bricks, topScore, players);
	}, 10);
}

/*************************** Drawing functions ********************************/
function draw(ctx, ball, paddles, bricks, score, players) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	paddles.forEach( (paddle) => {
		paddle.draw(ctx, paddle.colour);
		paddle.move();
	});
	if (!ball.bounceWall()) {
		if (!bouncePaddles(ball, paddles)) {
			if (ball.isOut()) {
				alert('GameOver');
				document.location.reload();
			} 
		} 
	}
	collisionDetection(ball, bricks, score, players);
	drawBricks(bricks,ctx);
	ball.draw(ctx);
	ball.move();
}

function drawBricks(bricks, ctx) {
	bricks.forEach( function(column) {
		column.forEach( function(brick) {
			if (brick.isVisible) {
				brick.draw(ctx, '#0095AD');
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

function bouncePaddles(ball, paddles) {
	let ret = false;
	paddles.forEach( (paddle) => {
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
			ball.ownerId = paddle.id;
			console.log("ID: " + ball.ownerId);
			ret = true;
		}
	});
	return ret;
}

function getActivePlayer(ball, players) {
	let activePlayer = null;

	players.forEach( (player) => {
		if (ball.ownerId == player.id) {
				console.log(JSON.stringify(player));
			activePlayer = player;
		}
	});
	return activePlayer;
}

function collisionDetection(ball, bricks, score, players) {
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
					let activePlayer = getActivePlayer(
						ball, players);
					updateScore(score, activePlayer);
					ball.stepY = -ball.stepY;
					ball.baseY = Math.abs(ball.baseY + 0.5);
					brick.isVisible = false;
				}
			}
		});
	});
}

/******************************** Defines *************************************/

function defineBall() {
	let ballX = canvas.width / 2;
	let ballY = canvas.height - 40;
	let ball = new Ball(ballX, ballY, 10, 3, -3);

	return ball;
}

function definePaddles() {
	let paddles = [];
	let pW = 75;
	let pH = 10;
	let p1X = (canvas.width - pW) / 3;
	let p1Y = canvas.height - 20;
	let p2X = (canvas.width - pW) / 1.33;
	let p2Y = canvas.height - 20;
	let paddle1 = new Paddle(p1X, p1Y, pW, pH, 7, 1); 
	let paddle2 = new Paddle(p2X, p2Y, pW, pH, 7, 2); 

	paddle1.defineColour();
	paddle2.defineColour();
	paddles.push(paddle1);
	paddles.push(paddle2);
	return paddles;
}

function definePlayers() {
	let players = [];
	let jay = player("Jay", 1);
	let bob = player("Silent Bob", 2);

	players.push(jay);
	players.push(bob);
	return players;
}
