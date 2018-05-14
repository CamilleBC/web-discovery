// Popup module for the modal "loose" box
var startupModal = document.getElementById('startup-screen')
var close = document.getElementsByClassName('close')[0]

window.onload = 'loadStartupScreen()'

function loadStartupScreen () {
}

close.onclick = function () {
  lostModal.style.display = 'none'
}

export function hello () {
  return 'Hello'
}
