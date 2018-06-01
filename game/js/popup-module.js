// Popup module for the modal "loose" box

function eraseAndFocusInput(input) {
  input.value = "";
  input.focus();
}

function getPlayers(nbPlayer) {
  let creationModal = document.getElementById("creation-modal");
  let inputOk = document.getElementById("ok-name");
  let inputClear = document.getElementById("clear-name");
  let inputName = document.getElementById("input-name");
  let nbPlayers = 0;
  let players = [];
  let startupModal = document.getElementById("startup-modal");

  switch (nbPlayer) {
    case "one-player":
      nbPlayers = 1;
      break;
    case "two-player":
      nbPlayers = 2;
      break;
    default:
      alert("Invalid number of players");
      break;
  }
  startupModal.style.display = "none";
  creationModal.style.display = "flex";
  eraseAndFocusInput(inputName);
  creationModal.addEventListener("click", function() {
    eraseAndFocusInput(inputName);
  });
  inputName.addEventListener("keypress", function(e) {
    onEnterInput(e);
  });
  inputOk.addEventListener("click", function() {
    initPlayer(nbPlayers);
  });
}

function initNbPlayerButtons() {
  let playerButtons = Array.from(document.getElementsByClassName("player-btn"));
  let startupModal = document.getElementById("startup-modal");

  startupModal.style.display = "flex";
  // Using dynamic DOM Event
  playerButtons.forEach(player => {
    player.addEventListener("click", function() {
      getPlayers(this.id);
    });
    player.addEventListener("keypress", function(e) {
      onNumberInput(e);
    });
  });
}

function initPlayer(nbPlayers) {
  let inputName = document.getElementById("input-name");
  let newPlayer = player(inputName.value, players.getPlayers().length + 1);

  players.addPlayer(newPlayer);
  if (players.getPlayerNumber() === nbPlayers) {
    let creationModal = document.getElementById("creation-modal");
    let fullScreen = document.getElementById("full-screen");

    paddles = definePaddles(players);
    createScoreHtml();
    fullScreen.style.display = "grid";
    creationModal.style.display = "none";
    pause = false;
  } else {
  }
}

function onEnterInput(e) {
  if (e.keyCode === 13) {
    let inputOk = document.getElementById("ok-name");
    inputOk.click();
    e.stopPropagation();
  }
}

function onNumberInput(e) {
  if (e.keyCode === 31 || e.keyCode === 97) {
    let inputOk = document.getElementById("ok-name");
    inputOk.click();
    e.stopPropagation();
  }
}
