(function(){

	var canvas = document.getElementById("THE_SNAKE"),
		ctx = canvas.getContext("2d");
		size = 40,
		pixelsize = 10;

	var snakeBlock = function(enabled, direction){
		this.enabled = enabled;
		this.direction = direction;
		this.delete = function(){
			this.enabled = false;
		};
		this.create = function(direction){
			this.enabled = true;
			this.direction = direction;
		};
		this.toString = function(){
			return this.enabled ? "1" : "0";
		};
	};

	var snake = new (function(){
		var _snakeBlocks = [];
		var _direction = "up";
		var _directionToSet = null;
		var _anchorPoint = {x: 0, y: 0};
		var _backAnchorPoint = {x: 0, y: 0};
		var _snakeLength = 1;
		var _needsToAddBlockCount = 0;
		var _isAlive = true;

		this.__init__ = function (){
			for (var x = 0; x < size; x++) {
				_snakeBlocks[x] = [];
				for (var y = 0; y < size; y++) {
					_snakeBlocks[x][y] = new snakeBlock(false, "none");
				}
			}

			var rndX = 	Math.floor(Math.random()*(size/2)+size/4),
				rndY = 	Math.floor(Math.random()*(size/2)+size/4);

			//create head
			_anchorPoint.x = rndX;
			_anchorPoint.y = rndY;
			_snakeBlocks[_anchorPoint.x][_anchorPoint.y].create(_direction); //[1, _direction];
			

			_backAnchorPoint.x = _anchorPoint.x;
			_backAnchorPoint.y = _anchorPoint.y;
			// _backAnchorPoint.x = rndX;
			// _backAnchorPoint.y = rndY+1;
			// _snakeBlocks[_backAnchorPoint.x ][_backAnchorPoint.y].create(_direction);

		};

		this.setDirection = function(val){
			
			if(_direction == "right" && val == "left")
				return;
			if(_direction == "left" && val == "right")
				return;
			if(_direction == "up" && val == "down")
				return;
			if(_direction == "down" && val == "up")
				return;

				_directionToSet = val;
			
		};

		this.addBlocks = function(count){
			_needsToAddBlockCount += count;
		};

		this.kill = function (){
			_isAlive = false;
			alert("You're failed!");
		};

		this.update = function(){

			if(!_isAlive)
				return;

			if(_directionToSet !== null)
			{
				_direction = _directionToSet;
				_directionToSet = null;

				_snakeBlocks[_anchorPoint.x][_anchorPoint.y].create(_direction);
			}


			if(_direction === "up"){
				//_snakeBlocks[_anchorPoint.x][_anchorPoint.y-1].create(_direction);
				_anchorPoint.y--;
			}
			if(_direction === "down"){
				//_snakeBlocks[_anchorPoint.x][_anchorPoint.y+1].create(_direction);
				_anchorPoint.y++;
			}
			if(_direction === "right"){
				//_snakeBlocks[_anchorPoint.x+1][_anchorPoint.y].create(_direction);
				_anchorPoint.x++;
			}
			if(_direction === "left"){
				//_snakeBlocks[_anchorPoint.x-1][_anchorPoint.y].create(_direction);
				_anchorPoint.x--;
			}

			//////////////////////
			// DUMB WAYS TO DIE
			//
			if(_anchorPoint.x >= size || _anchorPoint.y >= size || _snakeBlocks[_anchorPoint.x][_anchorPoint.y].enabled){
				this.kill();
				return;
			}
			/////////////////////

			_snakeBlocks[_anchorPoint.x][_anchorPoint.y].create(_direction);



			if(_needsToAddBlockCount == 0){
				var backAnchorPoint_old = _snakeBlocks[_backAnchorPoint.x][_backAnchorPoint.y];

				if(backAnchorPoint_old.direction === "up"){
					_snakeBlocks[_backAnchorPoint.x][_backAnchorPoint.y].delete();
					_backAnchorPoint.y--;
				}
				if(backAnchorPoint_old.direction === "down"){
					_snakeBlocks[_backAnchorPoint.x][_backAnchorPoint.y].delete();
					_backAnchorPoint.y++;
				}
				if(backAnchorPoint_old.direction === "right"){
					_snakeBlocks[_backAnchorPoint.x][_backAnchorPoint.y].delete();
					_backAnchorPoint.x++;
				}
				if(backAnchorPoint_old.direction === "left"){
					_snakeBlocks[_backAnchorPoint.x][_backAnchorPoint.y].delete();
					_backAnchorPoint.x--;
				}
			}else{
				_needsToAddBlockCount--;
				_snakeLength++;
			}

		};

		this.drow = function(ctx){

			ctx.fillStyle = _isAlive ? "#0000FF" : "#FF0000";

			ctx.font = "48px serif";
			ctx.fillText(_snakeLength, 0, 50);

			for (var x = 0; x < _snakeBlocks.length; x++) {
				for (var y = 0; y < _snakeBlocks[x].length; y++){
					if(_snakeBlocks[x][y].enabled){
						ctx.fillRect(x*pixelsize,y*pixelsize,pixelsize,pixelsize);
					}
				}
			}
		};

		this.__init__();

		this.blocks = _snakeBlocks;
	})();

	console.log(snake);

	var game = new (function(){

		var _ctx = ctx;

		this.__init__ = function (){
			canvas.width = size*pixelsize;
			canvas.height = size*pixelsize;
		};

		this.run = function (){
			window.requestAnimationFrame(function(){
				window.game.loop();
			});
		};

		this.loop = function(){
			_ctx.clearRect(0, 0, canvas.width, canvas.height);
			snake.update();
			snake.drow(_ctx);
			window.requestAnimationFrame(function(){
				setTimeout(function(){window.game.loop();},100);
				//window.game.loop();
			});
		};

	this.__init__();

	})();

	window.game = game;
	game.run();

	window.addEventListener("keyup", function(e){
		//console.log(e.keyCode);
		switch(e.keyCode){
			case 37:
			snake.setDirection("left");
			break;
			case 38:
			snake.setDirection("up");
			break;
			case 39:
			snake.setDirection("right");
			break;
			case 40:
			snake.setDirection("down");
			break;
			case 32:
			snake.addBlocks(10);
			break;
		}
	});

})();