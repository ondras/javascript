var Game = function(players) {
	this._players = players;
	this._currentPlayer = 0;

	var url = "https://atomy.firebaseio.com/hra123";
	this._firebase = new Firebase(url);
	
	for (var i=0; i<players.length; i++) {
		var player = players[i];
		if (!player) { continue; }
		
		var data = {
			name: player.getName(),
			color: player.getColor()
		}
		this._firebase.child(i).set(data);
	}

	this._firebase.on("value", this._onFirebaseChange, this);
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
		/* uložit tah do Firebase aktuálního hráče */
		if (!(player instanceof Player.Remote)) {
			var firebase = this._firebase.child(this._currentPlayer);
			firebase.push({x:xy.x, y:xy.y});
		}
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

	if (Game.isOver(scores)) { /* konec hry! */
		this._firebase.remove();
		return;
	} 

	this._currentPlayer = (this._currentPlayer+1) % this._players.length;
	this._askPlayer();
}

/* Změna dat ve firebase - připojení dalších hráčů */
Game.prototype._onFirebaseChange = function(snapshot) {
	if (snapshot.numChildren() != this._players.length) { return; }
	this._firebase.off("value");

	var data = snapshot.val();
	for (var p in data) {
		p = Number(p);
		if (this._players[p]) { continue; }

		var def = data[p]; 
		var firebase = this._firebase.child(p);
		var player = new Player.Remote(def.name, def.color, firebase);
		this._players[p] = player;
	} 

	/* dokončit initializaci */
	this._draw = new Draw();

	this._board = new Board(this._players, this._draw);
	this._board.onTurnDone = this._turnDone.bind(this);

	this._askPlayer();
}
