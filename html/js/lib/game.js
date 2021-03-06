/** Class representing The Main Game. */
import Scores from "./game_score.js";
import Snake from "./game_snake.js";
import Prop from "./game_prop.js";

export default class TheGame{
	constructor(){
		if(TheGame.instance){
			return TheGame.instance;
		}

		this._ctx =					null;
		this._width =				0;
		this._height =				0;
		this._fps =					15;
		this._fpsInterval = 		0;
		this._startTime =			0;
		this._now =					0;
		this._then =				0;
		this._elapsed =				0;
		this._FramesPerProp =		10;
		this._FramesFromLastProp =	0;
		this._maxPropsCount =		3;
		this._settings =			null;
		this._lives =				3;
		this._gameModeName =		"Default";
		this._settings =			{};
		this._userID =				localStorage.userID ? localStorage.userID : [localStorage.setItem("userID", Math.round(Math.pow(36, 30 + 1) - Math.random() * Math.pow(36, 30)).toString(36).slice(1)), localStorage.userID][1];
		this._userName =			localStorage.userName ? localStorage.userName : "";

		TheGame.instance = this;
	}

	/**
	 * Function initializete the game with settings
	 * @param {Object} settings - an array of keys that contain game parameters
	 */
	init(settings){
		this._settings = {};
		this._settings.game = settings.game ? Object.assign(window.gameData.defaultSettings.game, settings.game) : window.gameData.defaultSettings.game;
		this._settings.props = settings.props ? Object.assign(window.gameData.defaultSettings.props, settings.props) : window.gameData.defaultSettings.props;
		this._settings.snake = settings.snake ? Object.assign(window.gameData.defaultSettings.snake, settings.snake) : window.gameData.defaultSettings.snake;
		this._settings.ui = settings.ui ? Object.assign(window.gameData.defaultSettings.ui, settings.ui) : window.gameData.defaultSettings.ui;
		
		if(settings.name){
			document.body.className = settings.name;
			this._gameModeName = settings.name;
		}

		window.gameData.size = this._settings.game.size;
	  	window.gameData.pixelsize = this._settings.game.pixelsize;

		let canvas = document.querySelector(this._settings.ui.main_canvas);
		this._ctx = canvas.getContext("2d");

		window.gameData.scores = new Scores();
		window.gameData.scores.updateResults(this._userID, this._settings.ui.results_table);

	  	this._fps = this._settings.game.fps;
	  	this._FramesPerProp = this._settings.props.framesPerProp;
	  	this._maxPropsCount = this._settings.props.maxPropsCount;
	  	this._lives = this._settings.game.lives;

		canvas.width = window.gameData.size * window.gameData.pixelsize;
		canvas.height = window.gameData.size * window.gameData.pixelsize;

		this._width = window.gameData.size * window.gameData.pixelsize;
		this._height = window.gameData.size * window.gameData.pixelsize;

		window.gameData.props = [];
		
		window.gameData.snake = new Snake(this._settings.snake, this);

		this.message("Select mode by key (Z, X, C)");
	}

	/**
	 * Function initializete the game with mode number
	 * @param {Number} mode - number of mode
	 */
	initWithMode(mode){
		const difficulties = [{
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

	/**
	 * Function change game speed whaen snake eats block
	 */
	onEat(){
		if(this._fps < this._settings.snake.max_speed){
			this._fps = this._fps + this._settings.snake.additionalSpeed;
		}

		this._fpsInterval = 1000 / this._fps;
	}

	/**
	 * Function check if user have more lives when snake is dead or game is already over
	 */
	dead(){
		this._lives--;

		if (this._lives <= 0){
			window.gameData.isGameRun = false;
			window.gameData.isGameOver = true;
			
			this.message("Game Over (Press R)");
			
			if(this._userName === "")
			{
				this._userName = prompt("Enter Your Name");
				localStorage.userName = this._userName;
			}

			localStorage.record = localStorage.record ? (localStorage.record <= window.gameData.scores.getScores() ? window.gameData.scores.getScores() : localStorage.record) : window.gameData.scores.getScores();
			window.gameData.scores.sendResults([this._userName, this._userID, this._gameModeName, window.gameData.scores.getScores()],  this._settings.ui.results_table);
		} else {
			window.gameData.snake = new Snake(this._settings.snake, this);
		}
	}

	/**
	 * Function runs main game loop
	 */
	run(){
		this._fpsInterval = 1000 / this._fps;
	  	this._then = Date.now();
	  	this._startTime = this._then;
	  	
	  	window.gameData.isGameRun = true;
	  	window.gameData.isModeInitialised = true;

		this.loop();
	}

	/**
	 * Function pause/play game
	 */
	pause(){
		if(window.gameData.isGameRun){
			window.gameData.isPause = true;
			window.gameData.isGameRun = false;

			this.message("Game Paused (Press P)");
		} else {
			this.message("");
			window.gameData.isPause = false;
			window.gameData.isGameRun = true;
		}
	}

	/**
	 * Function re-initializete the game 
	 */
	restartGame(){
		if(!window.gameData.isModeInitialised){
			return;
		}

		window.gameData.snake = new Snake(this._settings.snake, this);
		window.gameData.scores = new Scores();

		this._FramesFromLastProp = 0;
		this._fps = this._settings.game.fps;
		this._fpsInterval = 1000 / this._fps;
		this._lives = this._settings.game.lives;

		window.gameData.props = [];
		window.gameData.isGameRun = true;
		window.gameData.isGameOver = false;
		window.gameData.isPause = false;

		this.message("");
	}

	/**
	 * Function check if new frame is needed
	 */
	loop(){
		requestAnimationFrame(function(){window.game.loop()});

		this._now = Date.now();
	  	this._elapsed = this._now - this._then;

	  	if (this._elapsed > this._fpsInterval) {
	  		this._then = this._now - (this._elapsed % this._fpsInterval);
			this.updateAndDrow();
		}
	}

	/**
	 * Function update and drow game every single frame
	 */
	updateAndDrow(){
		this._ctx.clearRect(0, 0, this._width, this._height);

		if(window.gameData.isGameRun){
			//Props generation
			if(this._FramesFromLastProp >= this._FramesPerProp && window.gameData.props.length < this._maxPropsCount){
				let newPropX = Math.floor(Math.random()*window.gameData.size),
					newPropY = Math.floor(Math.random()*window.gameData.size);
				
				do{
					newPropY = Math.floor(Math.random()*window.gameData.size);
					newPropY = Math.floor(Math.random()*window.gameData.size);
				}
				while(window.gameData.snake.isBlockExist(newPropX,newPropY));
				
				let newPropType = Math.random() <= this._settings.props.chanceOfBomb ? (Math.random() >= 0.7 ? 3 : 1) : (Math.random() >= 0.5 ? 2 : 0);
				let newProp = new Prop(newPropType, newPropX, newPropY, this._settings.props);
				
				window.gameData.props.push(newProp);
				this._FramesFromLastProp = 0;
			} else {
				this._FramesFromLastProp = this._FramesFromLastProp + 1;
			}

			window.gameData.props = window.gameData.props.filter(function(prop, index){
				window.gameData.props[index].framesLives = window.gameData.props[index].framesLives - 1;
				return window.gameData.props[index].framesLives > 0;
			});
			//Snake updates
			window.gameData.snake.update();
		}
		//Props Drow
		let _ctx = this._ctx;

		for(let prop of window.gameData.props){
			_ctx.fillStyle = prop.color;
			_ctx.fillRect(prop.point.x * window.gameData.pixelsize, prop.point.y * window.gameData.pixelsize, window.gameData.pixelsize, window.gameData.pixelsize);
		}

		// window.gameData.props.forEach(function(prop){
		// 	_ctx.fillStyle = prop.color;
		// 	_ctx.fillRect(prop.point.x * window.gameData.pixelsize, prop.point.y * window.gameData.pixelsize, window.gameData.pixelsize, window.gameData.pixelsize);
		// });
		
		//Snake Drow
		window.gameData.snake.drow(this._ctx);
		//Drow grid
		this._ctx.strokeStyle = "#f1f1f1";

		for (let i = 1; i < window.gameData.size; i++) {
			this._ctx.beginPath();
			this._ctx.moveTo(i * window.gameData.pixelsize,0);
			this._ctx.lineTo(i * window.gameData.pixelsize,window.gameData.size * window.gameData.pixelsize);
			this._ctx.stroke();
		}

		for (let i = 1; i < window.gameData.size; i++) {
			this._ctx.beginPath();
			this._ctx.moveTo(0, i * window.gameData.pixelsize);
			this._ctx.lineTo(window.gameData.size*window.gameData.pixelsize, i * window.gameData.pixelsize);
			this._ctx.stroke();
		}
		//Labels update
		this.updateStatus();
	}

	/**
	 * Function update game ui every single frame
	 */
	updateStatus(){
		let lives_label = document.querySelector(this._settings.ui.lives_label);
		let scores_label = document.querySelector(this._settings.ui.scores_label);
		let record_label = document.querySelector(this._settings.ui.record_label);

		lives_label.textContent = this._lives;
		scores_label.textContent = window.gameData.scores.getScores();
		record_label.textContent = localStorage.record ? localStorage.record : 0;

		document.querySelector(this._settings.ui.main_canvas).className = window.gameData.isPause ? "paused" : "run";
	}

	/**
	 * Function send message to user in main ui-label
	 * @param {String} msg - message
	 */
	message(msg){
		document.querySelector(this._settings ? this._settings.ui.status_label : defaultSettings.ui.status_label).textContent = msg;
	}

	/**
	 * Function call scores update method, when button pressed
	 */
	updateResults(){
		window.gameData.scores.updateResults(this._userID, this._settings.ui.results_table);
	}

}
	
// window.gameData = {};
// window.game = new TheGame();