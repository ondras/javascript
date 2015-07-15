var Draw = function() {
	this.LINE = 2;
	this.CELL = 60 + this.LINE;
	this.POSITIONS = [
		null,
		[new XY(1/2, 1/2)],
		[new XY(1/4, 1/4), new XY(3/4, 3/4)],
		[new XY(1/2, 1/2), new XY(1/4, 1/4), new XY(3/4, 3/4)],
		[new XY(1/4, 1/4), new XY(1/4, 3/4), new XY(3/4, 3/4), new XY(3/4, 1/4)],
		[new XY(1/2, 1/2), new XY(1/4, 1/4), new XY(1/4, 3/4), new XY(3/4, 3/4), new XY(3/4, 1/4)],
		[new XY(1/4, 1/4), new XY(1/4, 1/2), new XY(1/4, 3/4), new XY(3/4, 1/4), new XY(3/4, 1/2), new XY(3/4, 3/4)],
		[new XY(1/4, 1/4), new XY(1/4, 1/2), new XY(1/4, 3/4), new XY(1/2, 1/2), new XY(3/4, 1/4), new XY(3/4, 1/2), new XY(3/4, 3/4)],
		[new XY(1/4, 1/4), new XY(1/4, 1/2), new XY(1/4, 3/4), new XY(1/2, 1/4), new XY(1/2, 3/4), new XY(3/4, 1/4), new XY(3/4, 1/2), new XY(3/4, 3/4)]
	];

	/* Výroba canvasu a jeho příprava */
	var canvas = document.createElement("canvas");
	var size = Game.SIZE * this.CELL + this.LINE;		
	canvas.width = size;
	canvas.height = size;
	document.body.appendChild(canvas);

	this._context = canvas.getContext("webgl") 
		|| canvas.getContext("experimental-webgl");

	this._program = this._createShaderProgram();
}

/* Vykreslit celou plochu */
Draw.prototype.all = function(board) {
	var positions = [];
	var colors = [];

	for (var i=0; i<Game.SIZE; i++) {
		for (var j=0; j<Game.SIZE; j++) {
			var xy = new XY(i, j);
			this._addCell(board, xy, positions, colors);
		}
	}

	var gl = this._context;
	gl.clearColor(1, 1, 1, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	var posBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	var position = gl.getAttribLocation(this._program, "position");
	gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

	var colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	var color = gl.getAttribLocation(this._program, "color");
	gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.POINTS, 0, positions.length/2);
}

/* Převod pozice kurzoru na souřadnice buňky */
Draw.prototype.getPosition = function(cursor) {
	var rectangle = this._context.canvas.getBoundingClientRect();
	
	cursor.x -= rectangle.left;
	cursor.y -= rectangle.top;
	
	if (cursor.x < 0 || cursor.x > rectangle.width) { return null; }
	if (cursor.y < 0 || cursor.y > rectangle.height) { return null; }

	return cursor.divide(this.CELL);
}

/* Vyrobit WebGL shadery a program */
Draw.prototype._createShaderProgram = function() {
	var gl = this._context;

	var code = "\
    attribute vec2 position;                            \
    attribute vec3 color;                               \
    varying vec3 pixelColor;                            \
                                                        \
    void main(void) {                                   \
      vec2 clipPosition = position - vec2(0.5, 0.5);    \
      clipPosition *= vec2(2.0, -2.0);                  \
      gl_Position = vec4(clipPosition, 0, 1.0);         \
                                                        \
      gl_PointSize = 16.0;                              \
      pixelColor = color;                               \
    }";

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, code);
	gl.compileShader(vertexShader);

	var code = "\
    precision highp float;                            \
    varying vec3 pixelColor;                          \
                                                      \
    void main(void) {                                 \
      float dist = length(gl_PointCoord - vec2(0.5)); \
      if (dist > 0.5) { discard; }                    \
      if (dist > 0.4) {                               \
        gl_FragColor = vec4(0, 0, 0, 1.0);            \
      } else {                                        \
        gl_FragColor = vec4(pixelColor, 1.0);         \
      }                                               \
    }";

	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, code);
	gl.compileShader(fragmentShader);

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	gl.useProgram(program);

	var position = gl.getAttribLocation(program, "position");
	gl.enableVertexAttribArray(position);

	var color = gl.getAttribLocation(program, "color");
	gl.enableVertexAttribArray(color);

	return program;
}

/* Pro zadanou buňku nagenerovat souřadnice a barvy */
Draw.prototype._addCell = function(board, xy, positions, colors) {
	var atoms = board.getAtoms(xy);
	if (!atoms) { return; }

	var color = board.getPlayer(xy).getColor();
	var atomPositions = this.POSITIONS[atoms];
	var canvas = this._context.canvas;

	for (var i=0; i<atomPositions.length; i++) {
		var position = atomPositions[i];
		var atom = position.add(xy).multiply(this.CELL);
		positions.push(atom.x/canvas.width, atom.y/canvas.height);
		colors.push.apply(colors, color);
	}
}
