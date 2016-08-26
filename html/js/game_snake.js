window.gameData.Snake = function(settings, game){
		this._snakeBlocks =				[];
		this._direction =				"up";
		this._directionToSet =			null;
		this._anchorPoint =				{x: 0, y: 0};
		this._backAnchorPoint =			{x: 0, y: 0};
		this._snakeLength =				1;
		this._needsToAddBlockCount =	0;
		this._isAlive =					true;
		this._snakeColor =				{ alive: "#0000FF", dead: "#FF0000" };
		this._gameObj =					game;
		this._snakeColor.alive =		settings.color_alive;
		this._snakeColor.dead =			settings.color_dead;

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
};


window.gameData.Snake.prototype.setDirection = function(val){
	if( !window.gameData.isGameRun || (this._direction == "right" && val == "left") || (this._direction == "left" && val == "right") || (this._direction == "up" && val == "down") || (this._direction == "down" && val == "up"))
		return;

	this._directionToSet = val;
};

window.gameData.Snake.prototype.addBlocks =	function(count){
	this._needsToAddBlockCount = this._needsToAddBlockCount + count;
};

window.gameData.Snake.prototype.kill = function(){
	this._isAlive = false;
	this._gameObj.dead();
};

window.gameData.Snake.prototype.update = function(){
	if(!this._isAlive)
		return;

	if(this._directionToSet !== null)
		{
		this._direction = this._directionToSet;
		this._directionToSet = null;
		this._snakeBlocks[this._anchorPoint.x][this._anchorPoint.y].create(this._direction);
	}

	if(this._direction === "up"){
		this._anchorPoint.y = this._anchorPoint.y - 1;
	}

	if(this._direction === "down"){
		this._anchorPoint.y = this._anchorPoint.y + 1;
	}

	if(this._direction === "right"){
		this._anchorPoint.x = this._anchorPoint.x + 1;
	}

	if(this._direction === "left"){
		this._anchorPoint.x = this._anchorPoint.x - 1;
	}

	if( this._snakeLength + this._needsToAddBlockCount <= 0 || this._anchorPoint.x < 0 || this._anchorPoint.y < 0 || this._anchorPoint.x >= window.gameData.size || this._anchorPoint.y >= window.gameData.size || this._snakeBlocks[this._anchorPoint.x][this._anchorPoint.y].enabled){
		this.kill();
		return;
	}

	var snake = this;
	window.gameData.props = window.gameData.props.filter(function(prop){
		if(prop.point.x == snake._anchorPoint.x && prop.point.y == snake._anchorPoint.y)
		{
			snake._gameObj.onEat();
			snake.addBlocks(prop.calories);
			window.gameData.scores.addScores(prop.score);
			if(prop.isKilling){
				snake.addBlocks(0 - snake._snakeLength);
			}
			return false;
		}
		return true;
	});

	if(!this._isAlive)
		return;

	this._snakeBlocks[this._anchorPoint.x][this._anchorPoint.y].create(this._direction);

	if(this._needsToAddBlockCount < 1){
		var firstLoop = true;

		do{
			var backAnchorPoint_old = this._snakeBlocks[this._backAnchorPoint.x][this._backAnchorPoint.y];

			this._snakeBlocks[this._backAnchorPoint.x][this._backAnchorPoint.y].delete();

			if(backAnchorPoint_old.direction === "up"){
				this._backAnchorPoint.y--;
			}

			if(backAnchorPoint_old.direction === "down"){
				this._backAnchorPoint.y++;
			}

			if(backAnchorPoint_old.direction === "right"){
				this._backAnchorPoint.x++;
			}

			if(backAnchorPoint_old.direction === "left"){
				this._backAnchorPoint.x--;
			}

			if(!firstLoop){
				this._needsToAddBlockCount+= this._needsToAddBlockCount < 0 ? 1 : 0;
				this._snakeLength--;
			}else{
				firstLoop = false;
			}
		}
		while(this._needsToAddBlockCount < 0)
	}else{
		this._needsToAddBlockCount--;
		this._snakeLength++;
	}

};

window.gameData.Snake.prototype.drow = function(ctx){
	ctx.fillStyle = this._isAlive ? this._snakeColor.alive : this._snakeColor.dead;

	for (var x = 0; x < this._snakeBlocks.length; x++) {
		for (var y = 0; y < this._snakeBlocks[x].length; y++){
			if(this._snakeBlocks[x][y].enabled){
				ctx.fillRect(x * window.gameData.pixelsize, y * window.gameData.pixelsize, window.gameData.pixelsize, window.gameData.pixelsize);
			}
		}
	}
};

window.gameData.Snake.prototype.isBlockExist = function(x, y){
	return this._snakeBlocks[x][y].enabled;
};