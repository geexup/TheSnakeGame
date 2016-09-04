/** Class representing a Block that Snake can eat in game. */
export default class Prop{
	constructor(index, x, y, settings){
		this.point =		{x : x, y: y};
		this.score =		settings.scores[index];
		this.color =		settings.colors[index];
		this.calories =		settings.calories[index];
		this.framesLives =	settings.framesLives[index];
		this.isKilling =	settings.isKillings[index];
	}
}

//window.gameData.Prop = Prop;
