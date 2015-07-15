var Player = function(name, color) {
	this._color = color;
	this._score = document.createElement("span");

	var node = document.createElement("p");
	node.style.color = color;
	node.appendChild(document.createTextNode(name + ": "));
	node.appendChild(this._score);
	document.body.appendChild(node);
}

Player.prototype.getColor = function() {
	return this._color;
}

Player.prototype.setScore = function(score) {
	this._score.innerHTML = score;
}

Player.prototype.play = function(board, draw, callback) {
}
