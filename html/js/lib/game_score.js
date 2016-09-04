/** Class representing a Scores in the game. */
export default class Scores{
	constructor(){
		this._scoreVal = 0;
	}

	get scoreVal(){
		return this._scoreVal;
	}

	set scoreVal(val){
		this._scoreVal = val;
	}

	/**
	 * Function send current scores to server
	 * @param {array} result - an array that contain userID, name, nodeName, score count
	 * @param {String} result - a string that contain selector for table
	 */
	sendResults([name, usrID, modeName, score], table){
		let xhr = new XMLHttpRequest();
		let scrs = this;

		xhr.open("POST", "/Results", true);
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				scrs.updateResults(usrID, table);
			}
		};

		xhr.send(
			JSON.stringify({
				usrID,
				name,
				modeName,
				score
			})
		);
	}

	/**
	 * Function get top 10 players from server and displays users in table
	 * @param {String} userID - a strng that contain uniqe userID
	 * @param {String} result - a string that contain selector for table
	 */
	updateResults(userID, table){
		let xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				let htmlTable = '<tr align="left" class="header"><th>№</th><th>User Name</th><th>Game Mode</th><th>Scores</th></tr>';
				let records = JSON.parse(xhr.responseText);

				for (let i = 0; i < records.length; i++) {
					htmlTable = htmlTable + '<tr align="left" class="' + (records[i].me ? "me" : "") + '"><th>' + (i + 1) + '</th><th>' + records[i].name + '</th><th>' + records[i].modeName + '</th><th>' + records[i].score + '</th></tr>';
				}

				document.querySelector(table).innerHTML = htmlTable;
			}
		};

		xhr.open("GET", "/Results?usr=" + userID, true);
	  	xhr.send();
	}

	/**
	 * Function add amount of val scores to main score value
	 * @param {Number} val - amount of scores to add
	 * @return {Number} current scores
	 */
	addScores(val){
		this._scoreVal = this._scoreVal + val;
		return this.scoreVal;
	}

	/**
	 * Function remove amount of val scores to main score value
	 * @param {Number} val - amount of scores to remove
	 * @return {Number} current scores
	 */
	removeScores(val){
		this._scoreVal = this._scoreVal - val;
		return this._scoreVal;
	}

	/**
	 * Function return current scores
	 * @return {Number} current scores
	 */
	getScores(){
		return this._scoreVal;
	}
}



//window.gameData.Scores = Scores;
