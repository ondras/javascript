describe("Board", function() {
	var players = [
		new Player("Test 1", "blue"),
		new Player("Test 2", "red")
	];

	it("should be initially empty", function() {
		var board = new Board(players, null);
		
		for (var i=0; i<Game.SIZE; i++) {
			for (var j=0; j<Game.SIZE; j++) {
				var xy = new XY(i, j);
				expect(board.getAtoms(xy)).toBe(0);
			}
		}
	});

	it("should correctly add an atom", function() {
		var board = new Board(players, null);
		var xy = new XY(0, 0);
		board.addAtom(xy, players[0]);
		
		expect(board.getAtoms(xy)).toBe(1);
		expect(board.getPlayer(xy)).toBe(players[0]);
	});

	it("should correctly compute a score", function() {
		var board = new Board(players, null);
		board.addAtom(new XY(0, 0), players[0]);
		board.addAtom(new XY(1, 0), players[0]);
		board.addAtom(new XY(0, 1), players[1]);
		
		expect(board.getScoreFor(players[0])).toBe(2);
		expect(board.getScoreFor(players[1])).toBe(1);
	});

	it("should correctly explode", function() {
		var board = new Board(players, null);

		board.addAtom(new XY(0, 0), players[0]);
		board.addAtom(new XY(0, 0), players[0]);
		board.addAtom(new XY(0, 0), players[0]);
		
		expect(board.getScoreFor(players[0])).toBe(3);
		
		expect(board.getAtoms(new XY(0, 0))).toBe(1);
		expect(board.getAtoms(new XY(1, 0))).toBe(1);
		expect(board.getAtoms(new XY(0, 1))).toBe(1);
		expect(board.getAtoms(new XY(1, 1))).toBe(0);
	});

	it("should perform a chain reaction", function() {
		var board = new Board(players, null);

		for (var i=0; i<3; i++) {
			board.addAtom(new XY(1, 0), players[0]);
			board.addAtom(new XY(0, 0), players[0]);
		}
		
		expect(board.getScoreFor(players[0])).toBe(5);		
	});

});
