var Draw = {
	POSITIONS: [
		null,
		[[1/2, 1/2]],
		[[1/4, 1/4], [3/4, 3/4]],
		[[1/2, 1/2], [1/4, 1/4], [3/4, 3/4]],
		[[1/4, 1/4], [1/4, 3/4], [3/4, 3/4], [3/4, 1/4]]
	],
	CELL: 60,
	LINE: 2,
	ATOM: 7,
	_context: null
};

/* Výroba canvasu a jeho příprava */
Draw.init = function() {
	var canvas = document.createElement("canvas");
	
	this.CELL += this.LINE;

	var size = Game.SIZE * this.CELL + this.LINE;		
	canvas.width = size;
	canvas.height = size;

	this._context = canvas.getContext("2d");
	this._context.lineWidth = this.LINE;

	document.body.appendChild(canvas);
	
	this.all();
}

/* Vykreslit celou hrací plochu */
Draw.all = function() {
	this._context.fillStyle = "#fff";
	var width = this._context.canvas.width;
	var height = this._context.canvas.height;

	this._context.fillRect(0, 0, width, height);
	
	this._lines();
	this._cells();
}

/* Vykreslit mřížku */
Draw._lines = function() {
	this._context.beginPath();

	for (var i=0; i<Game.SIZE+1; i++) { // svislé
		var x = this.LINE/2 + i*this.CELL;
		this._context.moveTo(x, 0);
		this._context.lineTo(x, this._context.canvas.height);
	}

	for (var i=0; i<Game.SIZE+1; i++) { // vodorovné
		var y = this.LINE/2 + i*this.CELL;
		this._context.moveTo(0, y);
		this._context.lineTo(this._context.canvas.width, y);
	}

	this._context.stroke();
}

/* Vykreslit buňky s atomy */
Draw._cells = function() {
	for (var i=0; i<Game.SIZE; i++) {
		for (var j=0; j<Game.SIZE; j++) {
			var atoms = Board.getAtoms(i, j);
			if (atoms) { this._cell(i, j, atoms); }
		}
	}
}

/* Vykreslit jednu buňku */
Draw._cell = function(x, y, count) {
	var positions = this.POSITIONS[count];

	for (var i=0; i<positions.length; i++) {
		var position = positions[i];
		var posX = position[0];
		var posY = position[1];
		var atomX = (x + posX) * this.CELL;
		var atomY = (y + posY) * this.CELL;
		this._atom(atomX, atomY);
	}
}

/* Vykreslit jeden atom */
Draw._atom = function(x, y) {
	this._context.beginPath();

	this._context.moveTo(x+this.ATOM, y);
	this._context.arc(x, y, this.ATOM, 0, 2*Math.PI, false);
	
	this._context.fillStyle = "blue";
	this._context.fill();
	this._context.stroke();
}

/* Převod pozice kurzoru na souřadnice buňky */
Draw.getPosition = function(cursorX, cursorY) {
	var rectangle = this._context.canvas.getBoundingClientRect();
	
	cursorX -= rectangle.left;
	cursorY -= rectangle.top;
	
	if (cursorX < 0 || cursorX > rectangle.width) { return null; }
	if (cursorY < 0 || cursorY > rectangle.height) { return null; }

	var cellX = Math.floor(cursorX / this.CELL);
	var cellY = Math.floor(cursorY / this.CELL);
	return [cellX, cellY];
}
