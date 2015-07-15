var Audio = function() {
	this._ctx = null;
	try {
		this._ctx = new (window.AudioContext || window.webkitAudioContext)();
		this._build();
	} catch (e) {}
}

Audio.prototype.play = function(level) {
	if (!this._ctx) { return; }

	this._oscillator.frequency.value = 220 * Math.pow(2, level/12);
	this._gain.gain.value = 0.5;
}

Audio.prototype.stop = function() {
	if (!this._ctx) { return; }

	this._gain.gain.value = 0;
}

Audio.prototype._build = function() {
	this._gain = this._ctx.createGain();
	this._gain.gain.value = 0;
	this._gain.connect(this._ctx.destination);

	this._oscillator = this._ctx.createOscillator();
	this._oscillator.type = "square";
	this._oscillator.connect(this._gain);

	this._oscillator.start();
}
