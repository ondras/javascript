Player.Human = function(name, color) {
	Player.call(this, name, color);
}

Player.Human.prototype = Object.create(Player.prototype);

Player.Human.prototype.play = function(board, draw, callback) {
	this._callback = callback;
	this._draw = draw;
	document.body.addEventListener("click", this);
}

Player.Human.prototype.handleEvent = function(e) {
	var cursor = new XY(e.clientX, e.clientY);
	var position = this._draw.getPosition(cursor);
	if (!position) { return; }

	document.body.removeEventListener("click", this);

	this._callback(position);
}
