describe("XY", function() {
	it("should use zero as a default value", function() {
		var xy = new XY();
		
		expect(xy.x).toBe(0);
		expect(xy.y).toBe(0);
	});

	it("should compare against itself", function() {
		var xy1 = new XY(13, 15);
		var xy2 = new XY(14, 15);
		var xy3 = new XY(13, 15);

		expect(xy1.equals(xy2)).toBe(false);
		expect(xy1.equals(xy3)).toBe(true);
	});

	it("should return correct string value", function() {
		var xy = new XY(13, 15);
		expect(xy.toString()).toBe("13,15");
	});

	it("should parse string value", function() {
		var xy1 = new XY(13, 15);
		var xy2 = XY.fromString("13,15");
		expect(xy1.equals(xy2)).toBe(true);
	});

	it("should correctly add two instances", function() {
		var xy1 = new XY(13, 15);
		var xy2 = new XY(-5, 2);
		var xy3 = xy1.add(xy2);
		expect(xy3.x).toBe(8);
		expect(xy3.y).toBe(17);
	});
});
