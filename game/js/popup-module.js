// Popup module for the modal "loose" box
var lostModal = document.getElementById('myModal');
var close = document.getElementsByClassName("close")[0];

close.onclick = function() {
	lostModal.style.display = "none";
}

export function hello() {
	return "Hello";
}
