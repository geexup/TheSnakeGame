(function(){

/** Class representing a Bodypart of Snake. */
function SnakeBlock(enabled, direction){
	this.enabled =		enabled;
	this.direction =	direction;
};

SnakeBlock.prototype = {
	delete: deleteF,
	create: create,
	toString: toString
};

/**
 * Function delete block (makes it disabled)
 */
function deleteF(){
	this.enabled =		false;
};

/**
 * Function create (enable) snake block
 * @param {string} direction - direction of snake continuum
 */
function create(direction){
	this.enabled =		true;
	this.direction =	direction;
};

/**
 * Function returns text representation of block
 * @return {string} text representation ("0"/"1")
 */
function toString(){
	return this.enabled ? "1" : "0";
};

window.gameData.SnakeBlock = SnakeBlock;

})();