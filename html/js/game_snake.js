(function(){

//let _snakeBlocks, _direction, _directionToSet, _backAnchorPoint, _needsToAddBlockCount, _isAlive, _snakeColor;


class Snake{
	constructor(settings, game){
		this._snakeBlocks = [];
		this._direction = "up";
		this._directionToSet = null;
		this._anchorPoint = {x: 0, y: 0};
		this._backAnchorPoint = {x: 0, y: 0};
		this._snakeLength = 1;
		this._needsToAddBlockCount = 0;
		this._isAlive = true;
		this._snakeColor = {alive: "#0000FF", dead: "#FF0000"};

		this._gameObj = game;
		//this._anchorPoint = this._anchorPoint;
		//this._snakeLength = this._snakeLength;

		this._snakeColor.alive = settings.color_alive;
		this._snakeColor.dead = settings.color_dead;

		for (var x = 0; x < window.gameData.size; x++) {
			this._snakeBlocks[x] = [];

			for (var y = 0; y < window.gameData.size; y++) {
				this._snakeBlocks[x][y] = new window.gameData.SnakeBlock(false, "none");
			}
		}


		var rndX = Math.floor(Math.random() * (window.gameData.size / 2) + window.gameData.size / 4);
		var rndY = Math.floor(Math.random() * (window.gameData.size / 2) + window.gameData.size / 4);

		this._anchorPoint.x = rndX;
		this._anchorPoint.y = rndY;
		this._snakeBlocks[this._anchorPoint.x][this._anchorPoint.y].create(this._direction); 

		this._backAnchorPoint.x = this._anchorPoint.x;
		this._backAnchorPoint.y = this._anchorPoint.y;
	}

	/**
	 * Set new direction on update.
	 * @param {string} val - The String that contains new direction for Snake movement.
	 */
	setDirection(val){
		if( !window.gameData.isGameRun || (this._direction == "right" && val == "left")
			 || (this._direction == "left" && val == "right")
			 || (this._direction == "up" && val == "down")
			 || (this._direction == "down" && val == "up")
		){
			return;
		}

		this._directionToSet = val;
	}

	/**
	 * Tells Snake to add n-count blocks to body.
	 * @param {number} count - The Number of block needs to be added.
	 */
	addBlocks(count){
		this._needsToAddBlockCount = this._needsToAddBlockCount + count;
	}

	/**
	 * Tells Snake that death has come.
	 */
	kill(){
		this._isAlive = false;
		this._gameObj.dead();
	}

	/**
	 * Function updates variables every single frame
	 */
	update(){
		if(!this._isAlive)
			return;

		if(this._directionToSet !== null)
			{
			this._direction = this._directionToSet;
			this._directionToSet = null;
			this._snakeBlocks[this._anchorPoint.x][this._anchorPoint.y].create(this._direction);
		}

		switch(this._direction){
			case "up":		this._anchorPoint.y = this._anchorPoint.y - 1;	break;
			case "down":	this._anchorPoint.y = this._anchorPoint.y + 1;	break;
			case "right":	this._anchorPoint.x = this._anchorPoint.x + 1;	break;
			case "left":	this._anchorPoint.x = this._anchorPoint.x - 1;	break;
		}

		if( this._snakeLength + this._needsToAddBlockCount <= 0 ||
			this._anchorPoint.x < 0 || this._anchorPoint.y < 0 ||
			this._anchorPoint.x >= window.gameData.size ||
			this._anchorPoint.y >= window.gameData.size ||
			this._snakeBlocks[this._anchorPoint.x][this._anchorPoint.y].enabled
		){
			this.kill();
			return;
		}

		//let snake = this;
		window.gameData.props = window.gameData.props.filter(prop => {
			if(prop.point.x == this._anchorPoint.x && prop.point.y == this._anchorPoint.y)
			{
				this._gameObj.onEat();
				this.addBlocks(prop.calories);
				window.gameData.scores.addScores(prop.score);

				if(prop.isKilling){
					this.addBlocks(0 - this._snakeLength);
				}

				return false;
			}
			return true;
		});

		if(!this._isAlive)
			return;

		this._snakeBlocks[this._anchorPoint.x][this._anchorPoint.y].create(this._direction);

		if(this._needsToAddBlockCount < 1){
			let firstLoop = true;

			do {
				let backAnchorPoint_old = this._snakeBlocks[this._backAnchorPoint.x][this._backAnchorPoint.y];

				this._snakeBlocks[this._backAnchorPoint.x][this._backAnchorPoint.y].delete();

				switch(backAnchorPoint_old.direction){
					case "up":		this._backAnchorPoint.y--; break;
					case "down":	this._backAnchorPoint.y++; break;
					case "right":	this._backAnchorPoint.x++; break;
					case "left":	this._backAnchorPoint.x--; break;
				}

				if(!firstLoop){
					this._needsToAddBlockCount+= this._needsToAddBlockCount < 0 ? 1 : 0;
					this._snakeLength--;
				}else{
					firstLoop = false;
				}
			}
			while (this._needsToAddBlockCount < 0)

		} else {
			this._needsToAddBlockCount--;
			this._snakeLength++;
		}

	}

	/**
	 * Function drows The Snake on canvas
	 * @param {Canvas 2D Context} ctx - Context of 2D canvas, an element, where magic happens
	 */
	drow(ctx){
		ctx.fillStyle = this._isAlive ? this._snakeColor.alive : this._snakeColor.dead;

		for (let x = 0; x < this._snakeBlocks.length; x++) {
			for (let y = 0; y < this._snakeBlocks[x].length; y++){
				if(this._snakeBlocks[x][y].enabled){
					ctx.fillRect(x * window.gameData.pixelsize, y * window.gameData.pixelsize, window.gameData.pixelsize, window.gameData.pixelsize);
				}
			}
		}
	}

	/**
	 * Function checks for Snake existence in point
	 * @param {number} x - x coordinate of point
	 * @param {number} y - y coordinate of point
	 * @return {boolean} is exist?
	 */
	isBlockExist(x, y){
		return this._snakeBlocks[x][y].enabled;
	}
}


// /** Class representing a Snake in game. */
// function Snake(settings, game){
// 		_snakeBlocks =				[];
// 		_direction =				"up";
// 		_directionToSet =			null;
// 		_anchorPoint =				{x: 0, y: 0};
// 		_backAnchorPoint =			{x: 0, y: 0};
// 		_snakeLength =				1;
// 		_needsToAddBlockCount =		0;
// 		_isAlive =					true;
// 		_snakeColor =				{ alive: "#0000FF", dead: "#FF0000" };

// 		this._gameObj =				game;
// 		this._anchorPoint = _anchorPoint;
// 		this._snakeLength = _snakeLength;

// 		_snakeColor.alive =			settings.color_alive;
// 		_snakeColor.dead =			settings.color_dead;

// 		for (var x = 0; x < window.gameData.size; x++) {
// 			_snakeBlocks[x] = [];

// 			for (var y = 0; y < window.gameData.size; y++) {
// 				_snakeBlocks[x][y] = new window.gameData.SnakeBlock(false, "none");
// 			}
// 		}

// 		var rndX = Math.floor(Math.random() * (window.gameData.size / 2) + window.gameData.size / 4);
// 		var rndY = Math.floor(Math.random() * (window.gameData.size / 2) + window.gameData.size / 4);

// 		this._anchorPoint.x = rndX;
// 		this._anchorPoint.y = rndY;
// 		_snakeBlocks[this._anchorPoint.x][this._anchorPoint.y].create(_direction); 

// 		_backAnchorPoint.x = this._anchorPoint.x;
// 		_backAnchorPoint.y = this._anchorPoint.y;
// };

// Snake.prototype = {
// 	setDirection:	setDirection,
// 	addBlocks:		addBlocks,
// 	kill:			kill,
// 	update:			update,
// 	drow:			drow,
// 	isBlockExist:	isBlockExist,
// };

/**
 * Set new direction on update.
 * @param {string} val - The String that contains new direction for Snake movement.
 */
// function setDirection(val){
// 	if( !window.gameData.isGameRun || (_direction == "right" && val == "left")
// 		 || (_direction == "left" && val == "right")
// 		 || (_direction == "up" && val == "down")
// 		 || (_direction == "down" && val == "up")
// 	){
// 		return;
// 	}

// 	_directionToSet = val;
// };

/**
 * Tells Snake to add n-count blocks to body.
 * @param {number} count - The Number of block needs to be added.
 */
// function addBlocks(count){
// 	_needsToAddBlockCount = _needsToAddBlockCount + count;
// };

/**
 * Tells Snake that death has come.
 */
// function kill(){
// 	_isAlive = false;
// 	this._gameObj.dead();
// };

/**
 * Function updates variables every single frame
 */
// function update(){
// 	if(!_isAlive)
// 		return;

// 	if(_directionToSet !== null)
// 		{
// 		_direction = _directionToSet;
// 		_directionToSet = null;
// 		_snakeBlocks[this._anchorPoint.x][this._anchorPoint.y].create(_direction);
// 	}

// 	switch(_direction){
// 		case "up":		this._anchorPoint.y = this._anchorPoint.y - 1;	break;
// 		case "down":	this._anchorPoint.y = this._anchorPoint.y + 1;	break;
// 		case "right":	this._anchorPoint.x = this._anchorPoint.x + 1;	break;
// 		case "left":	this._anchorPoint.x = this._anchorPoint.x - 1;	break;
// 	}

// 	if( this._snakeLength + _needsToAddBlockCount <= 0 ||
// 		this._anchorPoint.x < 0 || this._anchorPoint.y < 0 ||
// 		this._anchorPoint.x >= window.gameData.size ||
// 		this._anchorPoint.y >= window.gameData.size ||
// 		_snakeBlocks[this._anchorPoint.x][this._anchorPoint.y].enabled
// 	){
// 		this.kill();
// 		return;
// 	}

// 	let snake = this;
// 	window.gameData.props = window.gameData.props.filter(function(prop) {
// 		if(prop.point.x == snake._anchorPoint.x && prop.point.y == snake._anchorPoint.y)
// 		{
// 			snake._gameObj.onEat();
// 			snake.addBlocks(prop.calories);
// 			window.gameData.scores.addScores(prop.score);

// 			if(prop.isKilling){
// 				snake.addBlocks(0 - snake._snakeLength);
// 			}

// 			return false;
// 		}
// 		return true;
// 	});

// 	if(!_isAlive)
// 		return;

// 	_snakeBlocks[this._anchorPoint.x][this._anchorPoint.y].create(_direction);

// 	if(_needsToAddBlockCount < 1){
// 		let firstLoop = true;

// 		do {
// 			let backAnchorPoint_old = _snakeBlocks[_backAnchorPoint.x][_backAnchorPoint.y];

// 			_snakeBlocks[_backAnchorPoint.x][_backAnchorPoint.y].delete();

// 			switch(backAnchorPoint_old.direction){
// 				case "up":		_backAnchorPoint.y--; break;
// 				case "down":	_backAnchorPoint.y++; break;
// 				case "right":	_backAnchorPoint.x++; break;
// 				case "left":	_backAnchorPoint.x--; break;
// 			}

// 			if(!firstLoop){
// 				_needsToAddBlockCount+= _needsToAddBlockCount < 0 ? 1 : 0;
// 				this._snakeLength--;
// 			}else{
// 				firstLoop = false;
// 			}
// 		}
// 		while (_needsToAddBlockCount < 0)

// 	} else {
// 		_needsToAddBlockCount--;
// 		this._snakeLength++;
// 	}

// };

/**
 * Function drows The Snake on canvas
 * @param {Canvas 2D Context} ctx - Context of 2D canvas, an element, where magic happens
 */
// function drow(ctx){
// 	ctx.fillStyle = _isAlive ? _snakeColor.alive : _snakeColor.dead;

// 	for (let x = 0; x < _snakeBlocks.length; x++) {
// 		for (let y = 0; y < _snakeBlocks[x].length; y++){
// 			if(_snakeBlocks[x][y].enabled){
// 				ctx.fillRect(x * window.gameData.pixelsize, y * window.gameData.pixelsize, window.gameData.pixelsize, window.gameData.pixelsize);
// 			}
// 		}
// 	}
// };

/**
 * Function checks for Snake existence in point
 * @param {number} x - x coordinate of point
 * @param {number} y - y coordinate of point
 * @return {boolean} is exist?
 */
// function isBlockExist(x, y){
// 	return _snakeBlocks[x][y].enabled;
// };


window.gameData.Snake = Snake;

})();