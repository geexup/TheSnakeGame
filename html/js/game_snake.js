window.gameData.snake = new (function(){
		var _snakeBlocks = [];
		var _direction = "up";
		var _directionToSet = null;
		var _anchorPoint = {x: 0, y: 0};
		var _backAnchorPoint = {x: 0, y: 0};
		var _snakeLength = 1;
		var _needsToAddBlockCount = 0;
		var _isAlive = true;

		var _snakeColor = {
				alive: "#0000FF",
				dead: "#FF0000"
			};

		var _gameObj = null;

		this.__init__ = __init__;
		this.setDirection = setDirection;
		this.addBlocks = addBlocks;
		this.kill = kill;
		this.update = update;
		this.drow = drow;

		function __init__(settings, game){
			_gameObj = game;

			_snakeColor.alive = settings.color_alive;
			_snakeColor.dead = settings.color_dead;

			for (var x = 0; x < window.gameData.size; x++) {
				_snakeBlocks[x] = [];
				for (var y = 0; y < window.gameData.size; y++) {
					_snakeBlocks[x][y] = new window.gameData.SnakeBlock(false, "none");
				}
			}

			var rndX = 	Math.floor(Math.random()*(window.gameData.size/2)+window.gameData.size/4);
			var rndY = 	Math.floor(Math.random()*(window.gameData.size/2)+window.gameData.size/4);

			_snakeLength = 1;
			_direction = "up";
			_directionToSet = null;
			_isAlive = true;
			_needsToAddBlockCount = 0;

			_anchorPoint.x = rndX;
			_anchorPoint.y = rndY;
			_snakeBlocks[_anchorPoint.x][_anchorPoint.y].create(_direction); 

			_backAnchorPoint.x = _anchorPoint.x;
			_backAnchorPoint.y = _anchorPoint.y;
		}

		function setDirection(val){
			if(!window.gameData.isGameRun)
				return;
			if(_direction == "right" && val == "left")
				return;
			if(_direction == "left" && val == "right")
				return;
			if(_direction == "up" && val == "down")
				return;
			if(_direction == "down" && val == "up")
				return;

			_directionToSet = val;
		}

		function addBlocks(count){
			_needsToAddBlockCount += count;
		}

		 function kill(){
			_isAlive = false;
			_gameObj.dead();
		}

		function update(){

			if(!_isAlive)
				return;

			if(_directionToSet !== null)
			{
				_direction = _directionToSet;
				_directionToSet = null;

				_snakeBlocks[_anchorPoint.x][_anchorPoint.y].create(_direction);
			}


			if(_direction === "up"){
				_anchorPoint.y--;
			}
			if(_direction === "down"){
				_anchorPoint.y++;
			}
			if(_direction === "right"){
				_anchorPoint.x++;
			}
			if(_direction === "left"){
				_anchorPoint.x--;
			}

			//////////////////////
			// DUMB WAYS TO DIE
			/////////////////////

			if( _snakeLength + _needsToAddBlockCount <= 0 || _anchorPoint.x < 0 || _anchorPoint.y < 0 || _anchorPoint.x >= window.gameData.size || _anchorPoint.y >= window.gameData.size || _snakeBlocks[_anchorPoint.x][_anchorPoint.y].enabled){
				this.kill();
				return;
			}

			/////////////////////

			window.gameData.props = window.gameData.props.filter(function(prop){
				if(prop.point.x == _anchorPoint.x && prop.point.y == _anchorPoint.y)
				{
					_gameObj.onEat();
					addBlocks(prop.calories);
					window.gameData.scores += prop.score;

					if(prop.isKilling){
						addBlocks(-_snakeLength);
					}
					
					return false;
				}
				return true;
			});

			if(!_isAlive)
				return;

			_snakeBlocks[_anchorPoint.x][_anchorPoint.y].create(_direction);

			if(_needsToAddBlockCount < 1){
				var firstLoop = true;
				do{
					var backAnchorPoint_old = _snakeBlocks[_backAnchorPoint.x][_backAnchorPoint.y];

					_snakeBlocks[_backAnchorPoint.x][_backAnchorPoint.y].delete();

					if(backAnchorPoint_old.direction === "up"){
						_backAnchorPoint.y--;
					}
					if(backAnchorPoint_old.direction === "down"){
						_backAnchorPoint.y++;
					}
					if(backAnchorPoint_old.direction === "right"){
						_backAnchorPoint.x++;
					}
					if(backAnchorPoint_old.direction === "left"){
						_backAnchorPoint.x--;
					}

					if(!firstLoop){
						_needsToAddBlockCount+= _needsToAddBlockCount < 0 ? 1 : 0;
						_snakeLength--;
					}else{

						firstLoop = false;
					}
				}
				while(_needsToAddBlockCount < 0)

			}else{
				_needsToAddBlockCount--;
				_snakeLength++;
			}

		};

		 function drow(ctx){

			ctx.fillStyle = _isAlive ? _snakeColor.alive : _snakeColor.dead;

			for (var x = 0; x < _snakeBlocks.length; x++) {
				for (var y = 0; y < _snakeBlocks[x].length; y++){
					if(_snakeBlocks[x][y].enabled){
						ctx.fillRect(x*window.gameData.pixelsize,y*window.gameData.pixelsize,window.gameData.pixelsize,window.gameData.pixelsize);
					}
				}
			}
		};

		this.blocks = _snakeBlocks;
	})();
