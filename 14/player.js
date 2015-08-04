var Player = function(name, color) {
	this._name = name;
	this._color = color;
	this._score = document.createElement("span");

	var node = document.createElement("p");
	node.style.color = color;
	node.appendChild(document.createTextNode(name + ": "));
	node.appendChild(this._score);
	document.body.appendChild(node);
}

Player.fromState = function(state) {
	var type = state.type;
	var f = Player[type];
	return new f(state.name, state.color);
}

Player.prototype.getColor = function() {
	return this._color;
}

Player.prototype.setScore = function(score) {
	this._score.innerHTML = score;
}

Player.prototype.play = function(board, draw, callback) {
}

Player.prototype.getState = function() {
	var state = {
		name: this._name,
		color: this._color
	};

	for (var p in Player) {
		if (this instanceof Player[p]) { state.type = p; }
	}

	return state;
}
