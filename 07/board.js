var Board = {
	_data: []
};

Board.init = function() {
	for (var i=0; i<Game.SIZE; i++) {
		this._data.push([]);
		for (var j=0; j<Game.SIZE; j++) {
			var limit = this._getLimit(i, j);			
			var cell = {
				atoms: 0,
				limit: limit
			}
			this._data[i].push(cell);
		}
	}
}

Board.getAtoms = function(x, y) {
	return this._data[x][y].atoms;
}

Board.addAtom = function(x, y) {
	var cell = this._data[x][y];
	cell.atoms++;
	
	if (cell.atoms > cell.limit) {
		var neighbors = this._getNeighbors(x, y);
		cell.atoms -= neighbors.length;
			
		for (var i=0; i<neighbors.length; i++) {
			var n = neighbors[i];
			this.addAtom(n[0], n[1]);
		}
	}
}

Board._getLimit = function(x, y) {
	var limit = 4;
	if (x == 0 || x+1 == Game.SIZE) { limit--; }
	if (y == 0 || y+1 == Game.SIZE) { limit--; }
	return limit;
}

Board._getNeighbors = function(x, y) {
	var results = [];
	if (  x > 0)         { results.push([x-1,   y]); }
	if (x+1 < Game.SIZE) { results.push([x+1,   y]); }
	if (  y > 0)         { results.push([  x, y-1]); }
	if (y+1 < Game.SIZE) { results.push([  x, y+1]); }
	return results;
}
