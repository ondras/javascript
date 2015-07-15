Player.AI = function(name, color) {
	Player.call(this, name, color);
}

Player.AI.prototype = Object.create(Player.prototype);

Player.AI.prototype.play = function(board, draw, callback) {
	var scores = {};
	
	for (var i=0; i<Game.SIZE; i++) {
		for (var j=0; j<Game.SIZE; j++) {
			var xy = new XY(i, j);
			var player = board.getPlayer(xy);
			if (player && player != this) { continue; }
			scores[xy] = this._getScore(board, xy);
		}
	}
	
	var best = this._pickBest(scores);
	callback(best);
}

Player.AI.prototype._getScore = function(board, xy) {
	var clone = board.clone();
	clone.addAtom(xy, this);
	return clone.getScoreFor(this);
}

Player.AI.prototype._pickBest = function(scores) {
	var positions = [];
	var best = 0;
	
	for (var p in scores) {
		var score = scores[p];

		if (score > best) { 
			best = score;
			positions = [];
		}

		if (score == best) { positions.push(p); }
	}
	
	var position = positions[Math.floor(Math.random() * positions.length)];
	return XY.fromString(position);
}
