var Player = {};

Player.startListening = function() {
	document.body.addEventListener("click", Player.click);
}

Player.stopListening = function() {
	document.body.removeEventListener("click", Player.click);
}

Player.click = function(e) {
	var position = Draw.getPosition(e.clientX, e.clientY);
	if (!position) { return; }

	var x = position[0];
	var y = position[1];
	Board.addAtom(x, y);
}
