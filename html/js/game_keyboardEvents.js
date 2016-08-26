window.addEventListener("keydown", function(e){
	switch(e.keyCode){
		case 37:
		case 65: window.gameData.snake.setDirection("left"); break;
		case 38:
		case 87: window.gameData.snake.setDirection("up"); break;
		case 39:
		case 68: window.gameData.snake.setDirection("right"); break;
		case 40:
		case 83: window.gameData.snake.setDirection("down"); break;
		case 80: window.game.pause(); break;
		case 77: window.game.initWithMode(); break;
		case 90: window.game.initWithMode(0); break;
		case 88: window.game.initWithMode(1); break;
		case 67: window.game.initWithMode(2); break;
		case 82: window.game.restartGame(); break;
	}
	switch(e.keyCode){
		case 37: case 65: case 38: case 87: case 39: case 68: case 40: case 83: case 80: case 77: case 90: case 88: case 67: case 82:
			e.preventDefault();
		break;
	};
});