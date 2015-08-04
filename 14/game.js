var Game = function() {
	this._players = [];
	this._currentPlayer = 0;
	this._draw = new Draw();
	this._board = null;
}
Game.SIZE = 6;

Game.isOver = function(score) {
	return (Math.max.apply(Math, score) == this.SIZE*this.SIZE);
}

Game.prototype.start = function(players) {
	this._players = players;

	this._board = new Board(players, this._draw);
	this._board.onTurnDone = this._turnDone.bind(this);

	this._askPlayer();
}

Game.prototype.canContinue = function() {
	return !!localStorage.getItem("atoms");
}

Game.prototype.save = function() {
	var data = {
		board: this._board.getState(),
		currentPlayer: this._currentPlayer,
		players: []
	};

	for (var i=0; i<this._players.length; i++) {
		data.players.push(this._players[i].getState());
	}

	var json = JSON.stringify(data);
	localStorage.setItem("atoms", json);
}

Game.prototype.load = function() {
	var json = localStorage.getItem("atoms");

	try {
		var data = JSON.parse(json);
	} catch (e) {
		alert("Badly formatted game data");
	}

	for (var i=0; i<data.players.length; i++) {
		this._players.push(Player.fromState(data.players[i]));
	}

	this._board = new Board(this._players, this._draw);
	this._board.onTurnDone = this._turnDone.bind(this);
	this._board.setState(data.board);

	this._currentPlayer = data.currentPlayer;

	this._updateScores();
	this._askPlayer();
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
	var scores = this._updateScores();

	if (Game.isOver(scores)) { /* konec hry! */
		localStorage.removeItem("atoms");
		return;
	}

	this._currentPlayer = (this._currentPlayer+1) % this._players.length;
	this.save();

	this._askPlayer();
}

Game.prototype._updateScores = function() {
	var scores = [];

	for (var i=0; i<this._players.length; i++) {
		var player = this._players[i];
		var score = this._board.getScoreFor(player);
		player.setScore(score);
		scores.push(score);
	}

	return scores;
}
