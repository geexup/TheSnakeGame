window.gameData.Prop = function Prop(index,x,y, settings){
	var _scores =		settings.scores;
	var _colors =		settings.colors;
	var _calories = 	settings.calories;
	var _framesLives =	settings.framesLives;
	var _isKillings =	settings.isKillings;

	this.point =		{x : x, y: y};
	this.score =		_scores[index];
	this.color =		_colors[index];
	this.calories =		_calories[index];
	this.framesLives =	_framesLives[index];
	this.isKilling =	_isKillings[index];
};