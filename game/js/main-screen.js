var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var pause = true;
var paddles = [];

class Form {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
  }
}

class Sphere extends Form {
  constructor(x, y, radius) {
    super(x, y);
    this.radius = radius;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
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
    this.origStepX = stepX;
    this.origStepY = stepY;
    this.baseX = stepX;
    this.baseY = stepY;
    this.slowDown = this.slowDown.bind(this);
    this.ownerId = 0;
    this.boost = false;
  }
  bounce(paddleCenter) {
    let offset = (this.x - paddleCenter) / 20;
    this.stepX += offset;
    if (!this.boost) {
      this.stepY = -this.stepY * 2;
      this.stepX *= 2;
      this.slowDown();
      this.boost = true;
    } else {
      this.stepY = -this.stepY;
    }
  }
  bounceWall() {
    let nextX = this.x + this.stepX;
    let nextY = this.y + this.stepY;
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
    let nextY = this.y + this.stepY;

    if (nextY > canvas.height - this.radius) return true;
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
      this.boost = false;
    } else {
      this.stepY = absBaseY;
      this.boost = false;
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
    this.colour = "red";
  }
  defineColour() {
    switch (this.id) {
      case 1:
        this.colour = "red";
        break;
      case 2:
        this.colour = "blue";
        break;
      case 3:
        this.colour = "green";
        break;
      case 4:
        this.colour = "yellow";
        break;
    }
  }
  eventListener() {
    document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
  }
  keyDownHandler(e) {
    if (this.id === 1) {
      if (e.keyCode === 39) {
        this.inputSet.right = true;
      } else if (e.keyCode === 37) {
        this.inputSet.left = true;
      }
    } else if (this.id === 2) {
      if (e.keyCode === 68) {
        this.inputSet.right = true;
      } else if (e.keyCode === 65) {
        this.inputSet.left = true;
      }
    }
  }
  keyUpHandler(e) {
    if (this.id === 1) {
      if (e.keyCode === 39) {
        this.inputSet.right = false;
      } else if (e.keyCode === 37) {
        this.inputSet.left = false;
      }
    } else if (this.id === 2) {
      if (e.keyCode === 68) {
        this.inputSet.right = false;
      } else if (e.keyCode === 65) {
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

/************************* Revealing Module Pattern ***************************/
var players = (function() {
  var array = [];
  var addPlayer = function(player) {
    array[array.length] = player;
  };
  var getBestPlayerName = function() {
    let name;
    let score = 0;
    array.forEach(player => {
      if (player.score > score) {
        name = player.name;
        score = player.score;
      } else if (player.score === score) {
        name = "Ex Aequo";
      }
    });
    return name;
  };
  var getPlayer = function(index) {
    return array[index];
  };
  var getPlayerNumber = function() {
    return array.length;
  };
  var getPlayerScore = function(index) {
    return array[index].score;
  };
  var getPlayerName = function(index) {
    return array[index].name;
  };
  var getPlayers = function() {
    return array;
  };
  var getTotalScore = function() {
    let total = 0;
    array.forEach(player => {
      total += player.score;
    });
    return total;
  };
  /* Explicitely return public pointers to the private members */
  return {
    addPlayer: addPlayer,
    getBestPlayerName: getBestPlayerName,
    getPlayer: getPlayer,
    getPlayerNumber: getPlayerNumber,
    getPlayerScore: getPlayerScore,
    getPlayerName: getPlayerName,
    getPlayers: getPlayers,
    getTotalScore: getTotalScore
  };
})();

/***************************** Main function **********************************/
main();

function main() {
  let ball = defineBall();
  let bricks = [];

  initNbPlayerButtons();
  // let paddles = definePaddles(players);
  buildBricks(bricks, 5, 4);
  setInterval(function() {
    if (!pause) {
      draw(ctx, ball, paddles, bricks, players);
    }
  }, 10);
}
/*********************** Restart function with promise ***********************/
function restart(ball, bricks, paddles) {
  let fullScreen = document.getElementById("full-screen");
  let gameOver = document.getElementById("gameover-screen");
  let okEnd = document.getElementById("ok-end");
  let cancelEnd = document.getElementById("cancel-end");

  fullScreen.style.display = "none";
  gameOver.style.display = "flex";
  pause = true;
  let restart = new Promise(function(resolve, reject) {
    okEnd.addEventListener("click", resolve);
    cancelEnd.addEventListener("click", reject);
  })
    .then(function() {
      ball.x = ball.originalX;
      ball.y = ball.originalY;
      ball.stepX = ball.origStepX;
      ball.stepY = ball.origStepY;
      ball.boost = false;
      ball.ownerId = 0;
      paddles.forEach(paddle => {
        paddle.x = paddle.originalX;
        paddle.y = paddle.originalY;
      });
      let playersArray = players.getPlayers();
      playersArray.forEach(player => {
        player.score = 0;
      });
      bricks.forEach(function(column) {
        column.forEach(function(brick) {
          brick.isVisible = true;
        });
      });
      updateScore();
      gameOver.style.display = "none";
      fullScreen.style.display = "grid";
      pause = false;
    })
    .catch(function() {
      alert("GameOver");
      gameOver.style.display = "none";
      fullScreen.style.display = "grid";
      document.location.reload();
    });
}

/*************************** Drawing functions ********************************/
function draw(ctx, ball, paddles, bricks, score) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  paddles.forEach(paddle => {
    paddle.draw(ctx, paddle.colour);
    paddle.move();
  });
  if (!ball.bounceWall()) {
    if (!bouncePaddles(ball, paddles)) {
      if (ball.isOut()) {
        restart(ball, bricks, paddles);
      }
    }
  }
  collisionDetection(ball, bricks, score, players);
  drawBricks(bricks, ctx);
  ball.draw(ctx);
  ball.move();
}

function drawBricks(bricks, ctx) {
  bricks.forEach(function(column) {
    column.forEach(function(brick) {
      if (brick.isVisible) {
        brick.draw(ctx, "#0095AD");
      }
    });
  });
  return bricks;
}

/**************************** Forms functions *********************************/
// Build bricks by sizing, spacing them depending on the number or col and rows
function buildBricks(bricks, bricksColumns, bricksRows) {
  let wPercent = percentage => canvas.width / 100 * percentage;
  let hPercent = percentage => canvas.height / 100 * percentage;
  let paddingCol = wPercent(10) / bricksColumns;
  let paddingRow = wPercent(6) / bricksRows;
  let w = canvas.width / bricksColumns - paddingCol;
  let h = hPercent(20) / bricksRows;

  for (var col = 0; col < bricksColumns; ++col) {
    bricks[col] = [];
    for (let row = 0; row < bricksRows; ++row) {
      let x = col * (w + paddingCol / 2) + paddingCol / 2;
      let y = row * (h + paddingRow / 2) + paddingRow / 2;
      bricks[col][row] = new Brick(x, y, w, h, true);
    }
  }
}

function bouncePaddles(ball, paddles) {
  let ret = false;
  let bounced = false;
  paddles.forEach(paddle => {
    let ballBottom = ball.y + ball.radius;
    let paddleRight = paddle.x + paddle.width;
    let ballOnPaddle = paddle.y - ball.radius;

    if (
      !bounced &&
      (ball.x > paddle.x && ball.x < paddleRight && ballBottom >= paddle.y)
    ) {
      if (ballBottom > paddle.y) {
        ball.y = ballOnPaddle;
      }
      let paddleCenter = paddle.x + paddle.width / 2;
      ball.bounce(paddleCenter);
      ball.ownerId = paddle.id;
      bounced == true;
      ret = true;
    }
  });
  return ret;
}

function getActivePlayer(ball, playersArray) {
  let activePlayer = null;

  playersArray.forEach(player => {
    if (ball.ownerId === player.id) {
      activePlayer = player;
    }
  });
  return activePlayer;
}

function collisionDetection(ball, bricks, players) {
  bricks.forEach(function(column) {
    column.forEach(function(brick) {
      if (brick.isVisible) {
        let ballTop = ball.y - ball.radius;
        let brickBottom = brick.y + brick.height;
        let brickRight = brick.x + brick.width;
        let ballOnBrick = brickBottom + ball.radius;

        if (ball.x > brick.x && ball.x < brickRight && ballTop <= brickBottom) {
          if (ballTop < brickBottom) {
            ball.y = ballOnBrick;
          }
          let activePlayer = getActivePlayer(ball, players.getPlayers());
          if (activePlayer) {
            activePlayer.score += 1;
            updateScore();
          }
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
  let x = canvas.width / 2;
  let y = canvas.height - 40;
  let radius = canvas.width / 100;
  let stepX = canvas.width / 400;
  let stepY = -(canvas.height / 250);
  let ball = new Ball(x, y, radius, stepX, stepY);

  return ball;
}

function definePaddles(players) {
  let paddles = [];
  playerNumber = players.getPlayerNumber();

  for (let i = 0; i < playerNumber; ++i) {
    let pW = canvas.width / 14;
    let pH = canvas.height / 50;
    let paddleCoefficient = (i + 1) / (playerNumber + 1);
    let pX = canvas.width * paddleCoefficient - pW;
    let pY = canvas.height - pH;
    let step = 7;
    let id = i + 1;
    let paddle = new Paddle(pX, pY, pW, pH, step, id);

    paddle.defineColour();
    paddles.push(paddle);
    paddle.eventListener();
  }
  return paddles;
}
