(function(){


/** Class representing a Bodypart of Snake. **/
class SnakeBlock{
	constructor(enabled, direction){
		this._enabled = enabled;
		this._direction = direction;
	}

	get enabled(){
		return this._enabled;
	}

	get direction(){
		return this._direction;
	}

	/**
 	 * Function delete block (makes it disabled)
 	 */
	delete(){
		this._enabled = false;
	}

	/**
     * Function create (enable) snake block
     * @param {string} direction - direction of snake continuum
 	 */
	create(direction){
		this._enabled = true;
		this._direction = direction;
	}

	/**
	 * Function returns text representation of block
	 * @return {string} text representation ("0"/"1")
	 */
	toString(){
		return this._enabled ? "1" : "0";
	}
}

window.gameData.SnakeBlock = SnakeBlock;


})();