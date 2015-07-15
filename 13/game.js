var Game = function(players) {
	this._players = players;
	this._currentPlayer = 0;
	
	this._draw = new Draw();

	this._board = new Board(players, this._draw);
	this._board.onTurnDone = this._turnDone.bind(this);

	this._askPlayer();
}
Game.SIZE = 6;

Game.isOver = function(score) {
	return (Math.max.apply(Math, score) == this.SIZE*this.SIZE);
}

Game.prototype._askPlayer = function() {
	var player = this._players[this._currentPlayer];
	player.play(this._board, this._draw, this._playerDone.bind(this));
}

Game.prototype._playerDone = function(xy) {
	var player = this._players[this._currentPlayer];
	var existing = this._board.getPlayer(xy);

	if (!existing || existing == player) { 
		this._board.addAtom(xy, player);
	} else {
		this._askPlayer();
	}
}

Game.prototype._turnDone = function() {
	var scores = [];

	for (var i=0; i<this._players.length; i++) {
		var player = this._players[i]; 
		var score = this._board.getScoreFor(player);
		player.setScore(score);
		scores.push(score);
	}

	if (Game.isOver(scores)) { return; } /* konec hry! */

	this._currentPlayer = (this._currentPlayer+1) % this._players.length;
	this._askPlayer();
}
