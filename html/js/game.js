(function(){

	var canvas = document.getElementById("THE_SNAKE");
	var ctx = canvas.getContext("2d");
	var size = 50;
	var pixelsize = 15;
	var props = [];
	var scores = 0;
	var isGameRun = false;
	var isPause = false;
	var isGameOver = false;

	var defaultSettings = {
		ui: {
			scores_label: ".scores",
			lives_label: ".lives",
			main_canvas: "#THE_SNAKE",
			status_label: ".status",
			results_table: "#resultsTable",
			record_label: "#record"
		},
		game: {
			size: 50,
			lives: 3,
			pixelsize: 15,
			fps: 15
		},
		props:{
			framesPerProp: 10,
			maxPropsCount: 3,
			scores: [50, -200, 300, 0],
			colors: ["#e0ba00", "#FF0000", "#00FF00", "#000"],
			calories: [1, -2, 2, 0],
			framesLives: [120, 10, 60, 200],
			isKillings: [false, false,false,true],

			chanceOfBomb: 0.1
		},
		snake:{
			color_alive: "#0000FF",
			color_dead: "#888",
			max_speed: 80,
			additionalSpeed: 0.2
		}
	};

	function randomString(length) {
    	return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
	}

	function Prop(index,x,y, settings){
		var _scores = settings.scores,
			_colors = settings.colors,
			_calories = settings.calories,
			_framesLives = settings.framesLives;
			_isKillings = settings.isKillings;

		this.point = {x : x, y: y};
		this.score = _scores[index];
		this.color = _colors[index];
		this.calories = _calories[index];
		this.framesLives = _framesLives[index];
		this.isKilling = _isKillings[index];
	};

	var game = new (function(){
		var _ctx = ctx,
			_stop = false,
			_frameCount = 0,
			_fps = 15, _fpsInterval, _startTime, _now, _then, _elapsed,
			_FramesPerProp = 10, _FramesFromLastProp = 0, _maxPropsCount = 3,
			_settings = null,
			_lives = 3,
			_userID = localStorage.userID ? localStorage.userID : [localStorage.setItem("userID", randomString(30)), localStorage.userID][1],
			_userName =  localStorage.userName ? localStorage.userName : "";
			_gameModeName = "Default";

		this.__init__ = __init__;
		this.initWithMode = initWithMode;
		this.initUI = initUI;
		this.run = run;
		this.loop = loop;
		this.updateAndDrow = updateAndDrow;
		this.restartGame = restartGame;
		this.pause = pause;
		this.dead = dead;
		this.onEat = onEat;
		this.updateStatus = updateStatus;
		this.updateResults = updateResults;
		this.message = message;

		function initUI(UISettings){
			defaultSettings.ui = UISettings ? Object.assign(defaultSettings.ui, UISettings) : defaultSettings.ui;

			if(_settings){
				_settings.ui = defaultSettings.ui;
			}else{
				_settings = {
					ui: defaultSettings.ui
				};
			}
		}

		function __init__(settings){

			_settings = {};

			_settings.game = settings.game ? Object.assign(defaultSettings.game, settings.game) : defaultSettings.game;
			_settings.props = settings.props ? Object.assign(defaultSettings.props, settings.props) : defaultSettings.props;
			_settings.snake = settings.snake ? Object.assign(defaultSettings.snake, settings.snake) : defaultSettings.snake;
			_settings.ui = settings.ui ? Object.assign(defaultSettings.ui, settings.ui) : defaultSettings.ui;

			if(settings.name){
				document.body.className = settings.name;
				_gameModeName = settings.name;
			}

			updateResults();

			snake.__init__(_settings.snake, this);

			scores = 0;

    		size = _settings.game.size;
    		pixelsize = _settings.game.pixelsize;
    		_fps = _settings.game.fps;
    		_FramesPerProp = _settings.props.framesPerProp;
    		_maxPropsCount = _settings.props.maxPropsCount;
    		_lives = _settings.game.lives;

			canvas.width = size*pixelsize;
			canvas.height = size*pixelsize;
		}

		function initWithMode(mode){
			var difficulties = [{
					name:	"EasyMode",
					props:	{ chanceOfBomb: 0.1 },
					game:	{ lives: 3, fps: 10 },
					snake:	{ additionalSpeed: 0.08 }
				},{
					name: "NormalMode",
					props:	{ chanceOfBomb: 0.25 },
					game:	{ lives: 2 },
					snake:	{ additionalSpeed: 0.4 }
				},{
					name: "HardCoreMode",
					props:	{ chanceOfBomb: 0.5 },
					game:	{ lives: 1, fps: 20 },
					snake:	{ additionalSpeed: 0.7 }
				}
			];

			this.__init__(typeof mode !== "undefined" ? difficulties[mode] : difficulties[prompt("0 - Easy, 1 - Normal, 2 - Hardcore")]);
			this.run();
			this.pause();
		}

		function sendResults(result){
			var xhr = new XMLHttpRequest();

			xhr.open("POST", "/Results", true);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

			xhr.send(JSON.stringify({
				usrID: _userID,
				name: result[0],
				modeName: result[2],
				score: result[3]
			}));

			updateResults();
		}

		function updateResults(){
			var xhttp = new XMLHttpRequest();

			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200) {
			    	var htmlTable = '<tr align="left" class="header"><th>№</th><th>User Name</th><th>Game Mode</th><th>Scores</th></tr>';
			    	var records = JSON.parse(xhttp.responseText);
			    	console.log(records);
			    	for (var i = 0; i < records.length; i++) {
			    		htmlTable += '<tr align="left" class="'+(records[i].me ? "me" : "")+'"><th>'+(i+1)+'</th><th>' + records[i].name+'</th><th>'+records[i].modeName+'</th><th>'+records[i].score+'</th></tr>';
			    	}
			    	console.log(document.querySelector(_settings.ui.results_table), _settings.ui.results_table);
			    	document.querySelector(_settings.ui.results_table).innerHTML = htmlTable;
				}
			};

			xhttp.open("GET", "/Results?usr="+_userID, true);
  			xhttp.send();
		}

		function onEat(){
			if(_fps < _settings.snake.max_speed)
				_fps += _settings.snake.additionalSpeed;

			_fpsInterval = 1000 / _fps;
		}

		function dead(){
			_lives--;

			if(_lives <= 0){
				isGameRun = false;
				isGameOver = true;

				if(_userName === "")
				{
					_userName = prompt("Enter Your Name");
					localStorage.userName = _userName;
				}

				localStorage.record = localStorage.record ? (localStorage.record <= scores ? scores : localStorage.record) : scores;
				sendResults([_userName, _userID, _gameModeName, scores]);
			}else{
				snake.__init__(_settings.snake, this);
			}
		}

		function run(){
			_fpsInterval = 1000 / _fps;
    		_then = Date.now();
    		_startTime = _then;

    		isGameRun = true;
			window.game.loop();
		}

		function pause(){
			if(isGameRun){
				isPause = true;
				isGameRun = false;
				message("Game Paused (Press P)");
			}else{
				message("");
				isPause = false;
				isGameRun = true;
			}
		}

		function restartGame(){
			snake.__init__(_settings.snake, this);

			scores = 0;
			_FramesFromLastProp = 0;
			_fps =_settings.game.fps;
			_fpsInterval = 1000 / _fps;
			_lives = _settings.game.lives;

			props = [];

			isGameRun = true;
			isGameOver = false;
			isPause = false;

			message("");
		}

		function loop(){
			requestAnimationFrame(loop);

			_now = Date.now();
    		_elapsed = _now - _then;

    		if (_elapsed > _fpsInterval) {
    			_then = _now - (_elapsed % _fpsInterval);

				updateAndDrow();
			}
		}

		function updateAndDrow()
		{
			_ctx.clearRect(0, 0, canvas.width, canvas.height);

			if(isGameRun){

				/////////////////
				//Props generation
				////////////////

				if(_FramesFromLastProp >= _FramesPerProp && props.length < _maxPropsCount){

					var newPropX = Math.floor(Math.random()*size),
						newPropY = Math.floor(Math.random()*size);
					do{
						newPropY = Math.floor(Math.random()*size);
						newPropY = Math.floor(Math.random()*size);
					}
					while(snake.blocks[newPropX][newPropY].enabled);

					var newPropType = Math.random() <= _settings.props.chanceOfBomb ? (Math.random() >= 0.7 ? 3 : 1) : (Math.random() >= 0.5 ? 2 : 0);
					var newProp = new Prop(newPropType, newPropX, newPropY, _settings.props);
					props.push(newProp);

					_FramesFromLastProp = 0;
				}else{
					_FramesFromLastProp++;
				}

				props = props.filter(function(prop, index){
					props[index].framesLives--;
					return props[index].framesLives > 0;
				});
			
				/////////////////
				//Snake updates
				////////////////

				snake.update();
			}

			/////////////////
			//Props Drow
			////////////////

			props.forEach(function(prop){
				_ctx.fillStyle = prop.color;
				_ctx.fillRect(prop.point.x*pixelsize,prop.point.y*pixelsize,pixelsize,pixelsize);
			});

			/////////////////
			//Snake Drow
			////////////////

			snake.drow(_ctx);

			/////////////////
			//Drow grid
			////////////////

			ctx.strokeStyle="#f1f1f1";

			for (var i = 1; i < size; i++) {
				ctx.beginPath();
				ctx.moveTo(i*pixelsize,0);
				ctx.lineTo(i*pixelsize,size*pixelsize);
				ctx.stroke();
			}
			for (var i = 1; i < size; i++) {
				ctx.beginPath();
				ctx.moveTo(0, i*pixelsize);
				ctx.lineTo(size*pixelsize, i*pixelsize);
				ctx.stroke();
			}

			/////////////////
			//Labels update
			////////////////

			updateStatus();
		}

		function updateStatus(){

			var lives_label = document.querySelector(_settings.ui.lives_label);
			lives_label.textContent = _lives;

			var scores_label = document.querySelector(_settings.ui.scores_label);
			scores_label.textContent = scores;

			var record_label = document.querySelector(_settings.ui.record_label);
			record_label.textContent = localStorage.record ? localStorage.record : 0;


			document.querySelector(_settings.ui.main_canvas).className = isPause ? "paused" : "run";
			
			if(isGameOver){
				message("Game Over (Press R)");
			}
		}

		function message(msg){
			document.querySelector(_settings ? _settings.ui.status_label : defaultSettings.ui.status_label).textContent = msg;
		}

	})();


	var snake = new (function(){
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

		function SnakeBlock(enabled, direction){
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
		}

		function __init__(settings, game){
			_gameObj = game;

			_snakeColor.alive = settings.color_alive;
			_snakeColor.dead = settings.color_dead;

			for (var x = 0; x < size; x++) {
				_snakeBlocks[x] = [];
				for (var y = 0; y < size; y++) {
					_snakeBlocks[x][y] = new SnakeBlock(false, "none");
				}
			}

			var rndX = 	Math.floor(Math.random()*(size/2)+size/4);
			var rndY = 	Math.floor(Math.random()*(size/2)+size/4);

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
			if(!isGameRun)
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

			if( _snakeLength + _needsToAddBlockCount <= 0 || _anchorPoint.x < 0 || _anchorPoint.y < 0 || _anchorPoint.x >= size || _anchorPoint.y >= size || _snakeBlocks[_anchorPoint.x][_anchorPoint.y].enabled){
				this.kill();
				return;
			}

			/////////////////////

			props = props.filter(function(prop){
				if(prop.point.x == _anchorPoint.x && prop.point.y == _anchorPoint.y)
				{
					_gameObj.onEat();
					addBlocks(prop.calories);
					scores += prop.score;
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
						ctx.fillRect(x*pixelsize,y*pixelsize,pixelsize,pixelsize);
					}
				}
			}
		};

		this.blocks = _snakeBlocks;
	})();


	window.game = game;
	game.initUI();
	game.updateResults();
	game.message("Select mode by key (Z, X, C)");

	setInterval(function(){
		game.updateResults();
	}, 3000);

	window.addEventListener("keydown", function(e){
		switch(e.keyCode){
			case 37:
			case 65:
				snake.setDirection("left");
				e.preventDefault();
				break;
			case 38:
			case 87:
				snake.setDirection("up");
				e.preventDefault();
				break;
			case 39:
			case 68:
				snake.setDirection("right");
				e.preventDefault();
				break;
			case 40:
			case 83:
				snake.setDirection("down");
				e.preventDefault();
				break;
			case 80:
				game.pause();
				e.preventDefault();
				break;
			case 77:
				game.initWithMode();
				e.preventDefault();
				break;
			case 90:
				game.initWithMode(0);
				e.preventDefault();
				break;
			case 88:
				game.initWithMode(1);
				e.preventDefault();
				break;
			case 67:
				game.initWithMode(2);
				e.preventDefault();
				break;
			case 82:
				game.restartGame();
				e.preventDefault();
				break;
		}
	});

})();