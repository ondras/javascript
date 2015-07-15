var Draw = {};

Draw.all = function() {
	var html = "<table>";
	for (var i=0; i<Board.length; i++) {
		html += "<tr>";
		for (var j=0; j<Board[i].length; j++) {
			html += "<td>";
			html += Draw.atoms(Board[j][i]);
			html += "</td>"
		}
		html += "</tr>";
	}
	html += "</table>";

	document.body.innerHTML = html;
}

Draw.atoms = function(count) {
	var result = "";

	for (var i=0; i<count; i++) {
		result += "o";
	}

	return result;
}

Draw.getPosition = function(node) {
	if (node.nodeName != "TD") { return null; }

	var x = 0;
	while (node.previousSibling) {
		x++;
		node = node.previousSibling;
	}

	var row = node.parentNode;
	var y = 0;
	while (row.previousSibling) {
		y++;
		row = row.previousSibling;
	}

	return [x, y];
}
