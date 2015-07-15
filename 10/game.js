var Game = {
	SIZE: 6
};

Game.start = function() {
	Board.init();
	Draw.init();
	Score.init();
	Player.startListening();
}
