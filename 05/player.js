var Player = {};

Player.listen = function() {
	document.body.addEventListener("click", Player.click);
}

Player.click = function(e) {
	var position = Draw.getPosition(e.target);
	if (!position) { return; }

	var x = position[0];
	var y = position[1];
	Board[x][y]++;
	Draw.all();
}
