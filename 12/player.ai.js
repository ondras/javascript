Player.AI = function(name, color) {
	Player.call(this, name, color);
}

Player.AI.prototype = Object.create(Player.prototype);

Player.AI.prototype.play = function(board, draw, callback) {
	var available = [];

	for (var i=0; i<Game.SIZE; i++) {
		for (var j=0; j<Game.SIZE; j++) {
			var xy = new XY(i, j);
			var player = board.getPlayer(xy);
			if (!player || player == this) { available.push(xy); }
		}
	}

	var index = Math.floor(Math.random() * available.length);
	callback(available[index]);
}
