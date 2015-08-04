var Draw = {
	POSITIONS: [
		null,
		[[1/2, 1/2]],
		[[1/4, 1/4], [3/4, 3/4]],
		[[1/2, 1/2], [1/4, 1/4], [3/4, 3/4]],
		[[1/4, 1/4], [1/4, 3/4], [3/4, 3/4], [3/4, 1/4]],
		[[1/2, 1/2], [1/4, 1/4], [1/4, 3/4], [3/4, 3/4], [3/4, 1/4]]
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
	this._context.fillStyle = "#000";
	this._context.fillRect(0, 0, size, size);

	for (var i=0; i<Game.SIZE; i++) {
		for (var j=0; j<Game.SIZE; j++) {
			this.cell(i, j);
		}
	}

	document.body.appendChild(canvas);
}

/* Vykreslit jednu buňku */
Draw.cell = function(x, y) {
	/* nejprve přemazat bílou */
	var size = this.CELL - this.LINE;
	var left = x*this.CELL + this.LINE;
	var top  = y*this.CELL + this.LINE;
	this._context.fillStyle = "#fff";
	this._context.fillRect(left, top, size, size);

	/* zjistit počet atomů */
	var count = Board.getAtoms(x, y);
	if (!count) { return; }

	/* a vykreslit je, stejně jako minule */
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

/* Vykreslit jeden atom */
Draw._atom = function(x, y) {
	this._context.beginPath();

	this._context.moveTo(x+this.ATOM, y);
	this._context.arc(x, y, this.ATOM, 0, 2*Math.PI, false);

	this._context.fillStyle = "blue";
	this._context.fill();
	this._context.stroke();
}

