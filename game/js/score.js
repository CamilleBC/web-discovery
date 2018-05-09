var sideLeft = document.getElementById('side-left');


/********** Using composition to create player scoreElmts *************************/
const canGetNameStr = (state) => ({
	getNameStr: () => {
		return "Player: " + state.name;
	}
})

const canGetScoreStr = (state) => ({
	getScoreStr: () => {
		return "Score: " + state.score;
	}
})

const canGetBestPlayerStr = (state) => ({
	getBestPlayerStr: () => {
		return "Best player: " + state.name;
	}
})

const canGetBestScoreStr = (state) => ({
	getBestScoreStr: () => {
		return "Highscore: " + state.score;
	}
})

const canIncreaseScore = (state) => ({
	increaseScore: () => {
		state.scoreElmt += 1;
	}
})

const canSetBestPlayer = (state) => ({
	setBestPlayer: (player) => {
		state.name = player;
	}
})

const player = (name, id) => {
	let state = {
		name,
		id,
		score: 0,
		timePlayed: 0
	}

	return Object.assign(state, canGetNameStr(state), canGetScoreStr(state),
		canIncreaseScore(state));
}

const highscore= (name) => {
	let state = {
		name,
		score: 0,
		timePlayed: 0
	}

	return Object.assign(state, canGetBestPlayerStr(state), 
		canSetBestPlayer(state), canGetBestScoreStr(state), 
		canIncreaseScore(state));
}
/******************************************************************************/

function createScoreHtml(highscore, players) {
	createHighscoreElmt(highscore);
	players.forEach( (player) => {
		createPlayerElmt(player);
	});
}

function updateScore(highscore, player) {
	let scoreElmt = document.getElementById('highscore');

	player.score += 1;
	if (player.score > highscore.score) {
		highscore.score = player.score;
		highscore.name = player.name;
		printHighscoreElmt(highscore);
	}
	printScore(player);
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

function setHsIds(playerHigh, scoreHigh, scoreElmt) {
	playerHigh.id = 'highscore-player';
	scoreHigh.id = 'highscore-score';
	scoreElmt.id = 'highscore';
}

function createHighscoreElmt(highscore) {
	let scoreElmt = document.createElement('div');
	let playerHigh = document.createElement('p');
	let br = document.createElement('br');
	let scoreHigh = document.createElement('p');
	let playerText = document.createTextNode(highscore.getBestPlayerStr());
	let scoreElmtText = document.createTextNode(highscore.getBestScoreStr());
	let background = document.createElement('div');

	setHsIds(playerHigh, scoreHigh, scoreElmt);
	setHsBackground(background);
	scoreElmt.style.display = 'block';
	scoreElmt.style.position = 'relative';
	playerHigh.align = 'center';
	scoreHigh.align = 'center';
	playerHigh.appendChild(playerText);
	scoreHigh.appendChild(scoreElmtText);
	scoreElmt.appendChild(background);
	scoreElmt.appendChild(playerHigh);
	scoreElmt.appendChild(br);
	scoreElmt.appendChild(scoreHigh);
	sideLeft.appendChild(scoreElmt);
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
		case 4:
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

function createPlayerElmt(player) {
	let playerElmt = document.createElement('div');
	let playerName = document.createElement('p');
	let score = document.createElement('p');
	let playerText = document.createTextNode(player.getNameStr());
	let scoreText = document.createTextNode(player.getScoreStr());
	let background = document.createElement('div');

	setPlBackground(background, player.id);
	playerElmt.id = 'player-' + player.name;
	score.id = 'player-' + player.name.toLowerCase() + '-score';
	score.appendChild(scoreText);
	score.align = 'center';
	playerElmt.style.display = 'block';
	playerElmt.style.position = 'relative';
	playerElmt.appendChild(background);
	playerElmt.appendChild(score);
	sideLeft.appendChild(playerElmt);
}

function printHighscoreElmt(highscore) {
	let player = document.getElementById('highscore-player');
	let score = document.getElementById('highscore-score');

	player.textContent = highscore.getBestPlayerStr();
	score.textContent = highscore.getBestScoreStr();
}

function printScore(player) {
	let score = document.getElementById('player-' 
		+ player.name.toLowerCase() + '-score');

	score.textContent = player.getScoreStr();
}

