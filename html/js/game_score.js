(function(){

/** Class representing a Scores in the game. */
function Scores(){
	this.scoreVal = 0;	
};

Scores.prototype = {
	sendResults:	sendResults,
	updateResults:	updateResults,
	addScores:		addScores,
	removeScores:	removeScores,
	getScores:		getScores
};

/**
 * Function send current scores to server
 * @param {array} result - an array that contain userID, name, nodeName, score count
 * @param {String} result - a string that contain selector for table
 */
function sendResults(result, table){
	var xhr = new XMLHttpRequest();
	var scrs = this;

	xhr.open("POST", "/Results", true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			scrs.updateResults(result[1], table);
		}
	};

	xhr.send(
		JSON.stringify({
			usrID:		result[1],
			name:		result[0],
			modeName:	result[2],
			score:		result[3]
		})
	);
};

/**
 * Function get top 10 players from server and displays users in table
 * @param {String} userID - a strng that contain uniqe userID
 * @param {String} result - a string that contain selector for table
 */
function updateResults(userID, table){
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var htmlTable = '<tr align="left" class="header"><th>№</th><th>User Name</th><th>Game Mode</th><th>Scores</th></tr>';
			var records = JSON.parse(xhr.responseText);

			for (var i = 0; i < records.length; i++) {
				htmlTable = htmlTable + '<tr align="left" class="' + (records[i].me ? "me" : "") + '"><th>' + (i + 1) + '</th><th>' + records[i].name + '</th><th>' + records[i].modeName + '</th><th>' + records[i].score + '</th></tr>';
			}

			document.querySelector(table).innerHTML = htmlTable;
		}
	};

	xhr.open("GET", "/Results?usr=" + userID, true);
  	xhr.send();
};

/**
 * Function add amount of val scores to main score value
 * @param {Number} val - amount of scores to add
 * @return {Number} current scores
 */
function addScores(val){
	this.scoreVal = this.scoreVal + val;
	return this.scoreVal;
};

/**
 * Function remove amount of val scores to main score value
 * @param {Number} val - amount of scores to remove
 * @return {Number} current scores
 */
function removeScores(val){
	this.scoreVal = this.scoreVal - val;
	return this.scoreVal;
};

/**
 * Function return current scores
 * @return {Number} current scores
 */
function getScores(){
	return this.scoreVal;
};

window.gameData.Scores = Scores;

})();