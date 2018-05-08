var sideLeft = document.getElementById('side-left');

var score = {
	name: 'Test',
	id: 1,
	mainScore: 0,
	timePlayed: 0
};

function updateScore(playerId) {
	let highscore = document.getElementById('highscore');
	let playerElmt = document.getElementById('player-' + score.name);

	score.mainScore += 1;
	if (highscore == null) {
		createHighscore(score);
		createEmptyElmt();
	} else {
		printHighscore(playerId);
	}
	if (playerElmt == null) {
		createPlayerElmt(score);
	} else {
		printScore(score);
	}
	// printTime();
}

function setHsBackground(background) {
	background.style.backgroundImage = "url('css/images/Stars_Background.png')";
	background.style.backgroundSize = '100%';
	background.style.borderRadius = '18%';
	background.style.opacity = '0.2';
	background.style.position = 'absolute';
	background.style.top = '0';
	background.style.bottom = '0';
	background.style.left = '0';
	background.style.right = '0';
}

function setHsIds(playerHigh, scoreHigh, highscore) {
	playerHigh.id = 'highscore-player';
	scoreHigh.id = 'highscore-score';
	highscore.id = 'highscore';
}

function createHighscore(score) {
	let highscore = document.createElement('div');
	let playerHigh = document.createElement('p');
	let br = document.createElement('br');
	let scoreHigh = document.createElement('p');
	let playerText = document.createTextNode('Best player: ' + score.name);
	let scoreText = document.createTextNode('Highscore: ' + score.mainScore);
	let background = document.createElement('div');

	setHsIds(playerHigh, scoreHigh, highscore);
	setHsBackground(background);
	highscore.style.display = 'block';
	highscore.style.position = 'relative';
	playerHigh.align = 'center';
	scoreHigh.align = 'center';
	playerHigh.appendChild(playerText);
	scoreHigh.appendChild(scoreText);
	highscore.appendChild(background);
	highscore.appendChild(playerHigh);
	highscore.appendChild(br);
	highscore.appendChild(scoreHigh);
	sideLeft.appendChild(highscore);
}

function setPlBackground(background, id) {
	switch (id) {
		case 1:
			background.style.background = 'red';
			break;
		case 2:
			background.style.background = 'blue';
			break;
		case 3:
			background.style.background = 'green';
			break;
		case 1:
			background.style.background = 'yellow';
			break;
	}
	background.style.opacity = 0.2;
	background.style.borderRadius = '18%';
	background.style.position = 'absolute';
	background.style.top = '0';
	background.style.bottom = '0';
	background.style.left = '0';
	background.style.right = '0';
}

function createPlayerElmt(score) {
	let playerElmt = document.createElement('div');
	let scoreElmt = document.createElement('p');
	let playerText = document.createTextNode('Player: ' + score.name);
	let scoreText = document.createTextNode('Score: ' + score.mainScore);
	let background = document.createElement('div');

	setPlBackground(background, score.id);
	playerElmt.id = 'player-' + score.name;
	console.log(playerElmt.id);
	scoreElmt.id = 'player-' + score.name + '-score';
	scoreElmt.appendChild(scoreText);
	scoreElmt.align = 'center';
	playerElmt.style.display = 'block';
	playerElmt.style.position = 'relative';
	playerElmt.appendChild(background);
	playerElmt.appendChild(scoreElmt);
	sideLeft.appendChild(playerElmt);
}

function printHighscore(playerId) {
	let scoreElmt = document.getElementById('highscore-score');

	scoreElmt.textContent = 'Highscore: ' + score.mainScore;
}

function printScore(score) {
	let scoreElmt = document.getElementById('player-' + score.name + '-score');

	scoreElmt.textContent = 'Score: ' + score.mainScore;
}

