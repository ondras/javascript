var Board = function(players, draw) {
	this.DELAY = 200;
	this.onTurnDone = function() {}; // zavoláme po každém tahu

	this._draw = draw;
	this._data = {};
	this._criticals = [];

	this._players = players;
	this._score = [];
	for (var i=0; i<players.length; i++) { this._score.push(0); }

	this._build();
}

Board.prototype.getAtoms = function(xy) {
	return this._data[xy].atoms;
}

Board.prototype.getPlayer = function(xy) {
	return this._data[xy].player;
}

Board.prototype.addAtom = function(xy, player) {
	this._addAndCheck(xy, player);

	if (Game.isOver(this._score)) {
		this.onTurnDone(this._score);
	} else if (this._criticals.length) {
		this._explode();
	} else { /* přidání bez rozpadu či konce hry */
		this.onTurnDone(this._score);
	}
}

Board.prototype._addAndCheck = function(xy, player) {
	var cell = this._data[xy];

	if (cell.player) { /* odebrat bod předchozímu, je-li */
		var oldPlayerIndex = this._players.indexOf(cell.player);
		this._score[oldPlayerIndex]--;
	}

	/* přidat bod novému */
	var playerIndex = this._players.indexOf(player);
	this._score[playerIndex]++;

	cell.player = player;
	cell.atoms++;
	this._draw.cell(xy, cell.atoms, cell.player);

	if (cell.atoms > cell.limit) {
		/* pokud už je ve frontě kritických, končíme */
		for (var i=0; i<this._criticals.length; i++) {
			var tmp = this._criticals[i];
			if (tmp.equals(xy)) { return; }
		}

		/* není, přidáme */
		this._criticals.push(xy);
	}
}

Board.prototype._explode = function() {
	var xy = this._criticals.shift();
	var cell = this._data[xy];

	var neighbors = xy.getNeighbors();
	cell.atoms -= neighbors.length;
	this._draw.cell(xy, cell.atoms, cell.player);

	for (var i=0; i<neighbors.length; i++) {
		this._addAndCheck(neighbors[i], cell.player);
	}

	if (Game.isOver(this._score)) {
		this.onTurnDone(this._score);
	} else if (this._criticals.length) {
		setTimeout(this._explode.bind(this), this.DELAY);
	} else { /* konec reakce, hra pokračuje */
		this.onTurnDone(this._score);
	}
}

Board.prototype._build = function() {
	for (var i=0; i<Game.SIZE; i++) {
		for (var j=0; j<Game.SIZE; j++) {
			var xy = new XY(i, j);
			var limit = this._getLimit(xy);
			var cell = {
				atoms: 0,
				limit: limit,
				player: null
			}
			this._data[xy] = cell;
		}
	}
}

Board.prototype._getLimit = function(xy) {
	return xy.getNeighbors().length;
}
