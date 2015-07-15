Player.Remote = function(name, color, firebase) {
	Player.call(this, name, color);
	firebase.on("child_added", this._onFirebaseChange, this);
}

Player.Remote.prototype = Object.create(Player.prototype);

Player.Remote.prototype.play = function(board, draw, callback) {
	this._callback = callback;
}

Player.Remote.prototype._onFirebaseChange = function(snapshot) {
	var data = snapshot.val();
	if (typeof(data) != "object") { return; }

	var xy = new XY(data.x, data.y);
	this._callback(xy);
}
