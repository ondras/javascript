var Board = {
	DELAY: 200,
	_data: {},
	_criticals: []
};

Board.init = function() {
	for (var i=0; i<Game.SIZE; i++) {
		for (var j=0; j<Game.SIZE; j++) {
			var xy = new XY(i, j);
			var limit = this._getLimit(xy);			
			var cell = {
				atoms: 0,
				limit: limit,
				player: -1
			}
			this._data[xy] = cell;
		}
	}
}

Board.getAtoms = function(xy) {
	return this._data[xy].atoms;
}

Board.getPlayer = function(xy) {
	return this._data[xy].player;
}

Board.addAtom = function(xy, player) {
	this._addAndCheck(xy, player);

	if (Score.isGameOver()) { 
		return;
	} else if (this._criticals.length) {
		Player.stopListening();
		this._explode();
	}
}

Board._addAndCheck = function(xy, player) {
	var cell = this._data[xy];
	
	Score.removePoint(cell.player);
	Score.addPoint(player);
	
	cell.atoms++;
	cell.player = player;

	Draw.cell(xy);

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

Board._explode = function() {
	var xy = this._criticals.shift();
	var cell = this._data[xy];
	
	var neighbors = xy.getNeighbors();
	cell.atoms -= neighbors.length;
	Draw.cell(xy);
		
	for (var i=0; i<neighbors.length; i++) {
		this._addAndCheck(neighbors[i], cell.player);
	}
	
	if (Score.isGameOver()) { 
		return; 
	} else if (this._criticals.length) {
		setTimeout(this._explode.bind(this), this.DELAY);
	} else {
		Player.startListening();
	}
}

Board._getLimit = function(xy) {
	return xy.getNeighbors().length;
}
