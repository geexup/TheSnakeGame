(function(){

	var canvas = document.getElementById("THE_SNAKE"),
		ctx = canvas.getContext("2d");
		size = 40,
		pixelsize = 10;

	


	var game = new (function(){
		var _ctx = ctx,
			_stop = false,
			_frameCount = 0,
			_fps = 10, 
			_fpsInterval, 
			_startTime, 
			_now, 
			_then, 
			_elapsed;

		this.__init__ = __init__;
		this.run = run;
		this.loop = loop;
		this.updateAndDrow = updateAndDrow;

		function __init__(){
			canvas.width = size*pixelsize;
			canvas.height = size*pixelsize;
		};

		function run(){
			_fpsInterval = 1000 / _fps;
    		_then = Date.now();
    		_startTime = _then;

			window.game.loop();
		};

		function loop(){
			requestAnimationFrame(loop);
			_now = Date.now();
    		_elapsed = _now - _then;

    		if (_elapsed > _fpsInterval) {
    			_then = _now - (_elapsed % _fpsInterval);

				updateAndDrow();
			}
		};
		function updateAndDrow()
		{
			_ctx.clearRect(0, 0, canvas.width, canvas.height);

			snake.update();
			snake.drow(_ctx);
		}

		this.__init__();
	})();


	var snake = new (function(){
		var _snakeBlocks = [],
			_direction = "up",
			_directionToSet = null,
			_anchorPoint = {x: 0, y: 0},
			_backAnchorPoint = {x: 0, y: 0},
			_snakeLength = 1,
			_needsToAddBlockCount = 0;
			_isAlive = true;


		this.__init__ = __init__;
		this.setDirection = setDirection;
		this.addBlocks = addBlocks;
		this.kill = kill;
		this.update = update;
		this.drow = drow;


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

		function __init__(){
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
			_snakeBlocks[_anchorPoint.x][_anchorPoint.y].create(_direction); 

			_backAnchorPoint.x = _anchorPoint.x;
			_backAnchorPoint.y = _anchorPoint.y;
		};

		function setDirection(val){
			
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

		function addBlocks(count){
			_needsToAddBlockCount += count;
		};

		 function kill(){
			_isAlive = false;
			alert("You're failed!");
		};

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
			//
			if(_anchorPoint.x < 0 || _anchorPoint.y < 0 || _anchorPoint.x >= size || _anchorPoint.y >= size || _snakeBlocks[_anchorPoint.x][_anchorPoint.y].enabled){
				this.kill();
				return;
			}
			/////////////////////

			_snakeBlocks[_anchorPoint.x][_anchorPoint.y].create(_direction);



			if(_needsToAddBlockCount == 0){
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

			}else{
				_needsToAddBlockCount--;
				_snakeLength++;
			}

		};

		 function drow(ctx){

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

	})();



	window.game = game;
	game.run();

	window.addEventListener("keydown", function(e){
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