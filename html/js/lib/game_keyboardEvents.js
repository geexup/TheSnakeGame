import TheGame from "./game.js";

export default function bindEvents(){

	let game = new TheGame();

	let keyEvents = {
		37: function(){ window.gameData.snake.setDirection("left"); },
		65: function(){	window.gameData.snake.setDirection("left"); },
		38: function(){	window.gameData.snake.setDirection("up"); },
		87: function(){	window.gameData.snake.setDirection("up"); },
		39: function(){	window.gameData.snake.setDirection("right"); },
		68: function(){	window.gameData.snake.setDirection("right"); },
		40: function(){ window.gameData.snake.setDirection("down"); },
		83: function(){ window.gameData.snake.setDirection("down"); },
		80: function(){	game.pause(); },
		77: function(){	game.initWithMode(); },
		90: function(){	game.initWithMode(0); },
		88: function(){	game.initWithMode(1); },
		67: function(){	game.initWithMode(2); },
		82: function(){	game.restartGame(); }
	};

	window.addEventListener("keydown", function(e){
		if(typeof keyEvents[e.keyCode] !== "undefined"){
			keyEvents[e.keyCode]();
			e.preventDefault();
		}
	});

};