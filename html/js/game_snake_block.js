(function(){

function SnakeBlock(enabled, direction){
	this.enabled =		enabled;
	this.direction =	direction;
};

SnakeBlock.prototype.delete = function(){
	this.enabled =		false;
};

SnakeBlock.prototype.create = function(direction){
	this.enabled =		true;
	this.direction =	direction;
};

SnakeBlock.prototype.toString = function(){
	return this.enabled ? "1" : "0";
};

window.gameData.SnakeBlock = SnakeBlock;

})();