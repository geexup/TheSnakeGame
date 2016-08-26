(function(){

var keyEvents = {};

keyEvents[37] = function(){ window.gameData.snake.setDirection("left"); };
keyEvents[65] = keyEvents[37];
keyEvents[38] = function(){ window.gameData.snake.setDirection("up"); };
keyEvents[87] = keyEvents[38];
keyEvents[39] = function(){ window.gameData.snake.setDirection("right"); };
keyEvents[68] = keyEvents[39];
keyEvents[40] = function(){ window.gameData.snake.setDirection("down"); };
keyEvents[83] = keyEvents[40];
keyEvents[80] = function(){ window.game.pause(); };
keyEvents[77] = function(){ window.game.initWithMode(); };
keyEvents[90] = function(){ window.game.initWithMode(0); };
keyEvents[88] = function(){ window.game.initWithMode(1); };
keyEvents[67] = function(){ window.game.initWithMode(2); };
keyEvents[82] = function(){ window.game.restartGame(); };

window.addEventListener("keydown", function(e){
	if(typeof keyEvents[e.keyCode] !== "undefined"){
		keyEvents[e.keyCode]();
		e.preventDefault();
	}
});

})();