window.gameData.defaultSettings = {
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

window.gameData.props = [];
window.gameData.scores = 0;
window.gameData.isGameRun = false;
window.gameData.isPause = false;
window.gameData.isGameOver = false;