// Popup module for the modal "loose" box

function initPlayer(nbPlayers) {
  let creationModal = document.getElementById("creation-modal");
  let nameInput = document.getElementById("name-input");
  let newPlayer = player(nameInput.value, 1);

  players.addPlayer(newPlayer);
  console.log(JSON.stringify(players.getPlayers()));
  console.log(players.getPlayerNumber());
  if (players.getPlayerNumber() === nbPlayers) {
    createScoreHtml();
    creationModal.style.display = "none";
    pause = false;
  } else {
  }
}

function getPlayers(nbPlayer) {
  let startupModal = document.getElementById("startup-modal");
  let creationModal = document.getElementById("creation-modal");
  let inputOk = document.getElementById("ok-name");
  let players = [];
  let nbPlayers = 0;

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
  inputOk.addEventListener("click", function() {
    initPlayer(nbPlayers);
  });
}

function initNbPlayerButtons() {
  let startupModal = document.getElementById("startup-modal");
  let playerButtons = Array.from(document.getElementsByClassName("player-btn"));

  startupModal.style.display = "flex";
  console.log(playerButtons);
  // Using dynamic DOM Event
  playerButtons.forEach(player => {
    player.addEventListener("click", function() {
      getPlayers(this.id);
    });
  });
}
