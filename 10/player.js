var Player = {
	_current: 0
};

Player.startListening = function() {
	document.body.addEventListener("click", Player);
}

Player.stopListening = function() {
	document.body.removeEventListener("click", Player);
}

Player.handleEvent = function(e) {
	var position = Draw.getPosition(e.clientX, e.clientY);
	if (!position) { return; }

	var x = position[0];
	var y = position[1];

	var existing = Board.getPlayer(x, y);
	if (existing != -1 && existing != this._current) { return; }

	Board.addAtom(x, y, this._current);
	this._current = (this._current + 1) % Score.getPlayerCount();
}
