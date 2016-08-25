(function(){

	function randomString(length) {
    	return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
	}

	var game = new (function(){
		var _ctx = null;
		var _width = 0, _height = 0;
		//FPS Controll
		var _fps = 15, _fpsInterval, _startTime, _now, _then, _elapsed;
		//Prop Generation
		var _FramesPerProp = 10, _FramesFromLastProp = 0, _maxPropsCount = 3;
		//Settings
		var _settings = null;
		//Lives
		var _lives = 3;
		//LocalStorage, User name and id
		var _userID = localStorage.userID ? localStorage.userID : [localStorage.setItem("userID", randomString(30)), localStorage.userID][1];
		var _userName =  localStorage.userName ? localStorage.userName : "";
		//Default Game Mode Name
		var _gameModeName = "Default";

		this.init = __init__;
		this.initWithMode = initWithMode;
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

		function __init__(settings){
			_settings = {};

			_settings.game = settings.game ? Object.assign(window.gameData.defaultSettings.game, settings.game) : window.gameData.defaultSettings.game;
			_settings.props = settings.props ? Object.assign(window.gameData.defaultSettings.props, settings.props) : window.gameData.defaultSettings.props;
			_settings.snake = settings.snake ? Object.assign(window.gameData.defaultSettings.snake, settings.snake) : window.gameData.defaultSettings.snake;
			_settings.ui = settings.ui ? Object.assign(window.gameData.defaultSettings.ui, settings.ui) : window.gameData.defaultSettings.ui;

			if(settings.name){
				document.body.className = settings.name;
				_gameModeName = settings.name;
			}

			window.gameData.size = _settings.game.size;
    		window.gameData.pixelsize = _settings.game.pixelsize;

			var canvas = document.querySelector(_settings.ui.main_canvas);
			_ctx = canvas.getContext("2d");

			updateResults();

			window.gameData.scores = 0;

    		_fps = _settings.game.fps;
    		_FramesPerProp = _settings.props.framesPerProp;
    		_maxPropsCount = _settings.props.maxPropsCount;
    		_lives = _settings.game.lives;

			canvas.width = window.gameData.size*window.gameData.pixelsize;
			canvas.height = window.gameData.size*window.gameData.pixelsize;
			_width = window.gameData.size *window.gameData.pixelsize;
			_height = window.gameData.size *window.gameData.pixelsize;

			console.log(_settings);

			window.gameData.snake.__init__(_settings.snake, this);
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

			this.init(typeof mode !== "undefined" ? difficulties[mode] : difficulties[prompt("0 - Easy, 1 - Normal, 2 - Hardcore")]);
			this.run();
			this.pause();
		}

		function sendResults(result){
			var xhr = new XMLHttpRequest();

			xhr.open("POST", "/Results", true);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && xhr.status == 200) {
					updateResults();
				}
			};

			xhr.send(JSON.stringify({
				usrID: _userID,
				name: result[0],
				modeName: result[2],
				score: result[3]
			}));
		}

		function updateResults(){
			var xhttp = new XMLHttpRequest();

			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200) {

			    	var htmlTable = '<tr align="left" class="header"><th>№</th><th>User Name</th><th>Game Mode</th><th>Scores</th></tr>';
			    	var records = JSON.parse(xhttp.responseText);

			    	for (var i = 0; i < records.length; i++) {
			    		htmlTable += '<tr align="left" class="'+(records[i].me ? "me" : "")+'"><th>'+(i+1)+'</th><th>' + records[i].name+'</th><th>'+records[i].modeName+'</th><th>'+records[i].score+'</th></tr>';
			    	}

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
				window.gameData.isGameRun = false;
				window.gameData.isGameOver = true;
				
				message("Game Over (Press R)");

				if(_userName === "")
				{
					_userName = prompt("Enter Your Name");
					localStorage.userName = _userName;
				}

				localStorage.record = localStorage.record ? (localStorage.record <= window.gameData.scores ? window.gameData.scores : localStorage.record) : window.gameData.scores;
				sendResults([_userName, _userID, _gameModeName, window.gameData.scores]);
			}else{
				window.gameData.snake.__init__(_settings.snake, this);
			}
		}

		function run(){
			_fpsInterval = 1000 / _fps;
    		_then = Date.now();
    		_startTime = _then;

    		window.gameData.isGameRun = true;
			window.game.loop();
		}

		function pause(){
			if(window.gameData.isGameRun){
				window.gameData.isPause = true;
				window.gameData.isGameRun = false;
				message("Game Paused (Press P)");
			}else{
				message("");
				window.gameData.isPause = false;
				window.gameData.isGameRun = true;
			}
		}

		function restartGame(){
			window.gameData.snake.__init__(_settings.snake, this);

			window.gameData.scores = 0;
			_FramesFromLastProp = 0;
			_fps =_settings.game.fps;
			_fpsInterval = 1000 / _fps;
			_lives = _settings.game.lives;

			window.gameData.props = [];

			window.gameData.isGameRun = true;
			window.gameData.isGameOver = false;
			window.gameData.isPause = false;

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
			_ctx.clearRect(0, 0, _width, _height);

			if(window.gameData.isGameRun){
				//Props generation
				if(_FramesFromLastProp >= _FramesPerProp && window.gameData.props.length < _maxPropsCount){

					var newPropX = Math.floor(Math.random()*window.gameData.size),
						newPropY = Math.floor(Math.random()*window.gameData.size);
					do{
						newPropY = Math.floor(Math.random()*window.gameData.size);
						newPropY = Math.floor(Math.random()*window.gameData.size);
					}
					while(window.gameData.snake.blocks[newPropX][newPropY].enabled);

					var newPropType = Math.random() <= _settings.props.chanceOfBomb ? (Math.random() >= 0.7 ? 3 : 1) : (Math.random() >= 0.5 ? 2 : 0);
					var newProp = new window.gameData.Prop(newPropType, newPropX, newPropY, _settings.props);
					window.gameData.props.push(newProp);

					_FramesFromLastProp = 0;
				}else{
					_FramesFromLastProp++;
				}

				window.gameData.props = window.gameData.props.filter(function(prop, index){
					window.gameData.props[index].framesLives--;
					return window.gameData.props[index].framesLives > 0;
				});
			
				//Snake updates
				window.gameData.snake.update();
			}

			//Props Drow
			window.gameData.props.forEach(function(prop){
				_ctx.fillStyle = prop.color;
				_ctx.fillRect(prop.point.x*window.gameData.pixelsize,prop.point.y*window.gameData.pixelsize,window.gameData.pixelsize,window.gameData.pixelsize);
			});

			//Snake Drow
			window.gameData.snake.drow(_ctx);

			//Drow grid
			_ctx.strokeStyle="#f1f1f1";

			for (var i = 1; i < window.gameData.size; i++) {
				_ctx.beginPath();
				_ctx.moveTo(i*window.gameData.pixelsize,0);
				_ctx.lineTo(i*window.gameData.pixelsize,window.gameData.size*window.gameData.pixelsize);
				_ctx.stroke();
			}
			for (var i = 1; i < window.gameData.size; i++) {
				_ctx.beginPath();
				_ctx.moveTo(0, i*window.gameData.pixelsize);
				_ctx.lineTo(window.gameData.size*window.gameData.pixelsize, i*window.gameData.pixelsize);
				_ctx.stroke();
			}

			//Labels update
			updateStatus();
		}

		function updateStatus(){

			var lives_label = document.querySelector(_settings.ui.lives_label);
			lives_label.textContent = _lives;

			var scores_label = document.querySelector(_settings.ui.scores_label);
			scores_label.textContent = window.gameData.scores;

			var record_label = document.querySelector(_settings.ui.record_label);
			record_label.textContent = localStorage.record ? localStorage.record : 0;


			document.querySelector(_settings.ui.main_canvas).className = window.gameData.isPause ? "paused" : "run";
		}

		function message(msg){
			document.querySelector(_settings ? _settings.ui.status_label : defaultSettings.ui.status_label).textContent = msg;
		}

	})();

	window.gameData = {};
	window.game = game;
})();