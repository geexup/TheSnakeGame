window.gameData.Scores = function(){
	this.scoreVal = 0;	
};

window.gameData.Scores.prototype.sendResults = function(result, table){
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

window.gameData.Scores.prototype.updateResults = function updateResults(userID, table){
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

window.gameData.Scores.prototype.addScores = function(val){
	this.scoreVal = this.scoreVal + val;
	return this.scoreVal;
};

window.gameData.Scores.prototype.removeScores = function(val){
	this.scoreVal = this.scoreVal - val;
	return this.scoreVal;
};

window.gameData.Scores.prototype.getScores = function(val){
	return this.scoreVal;
};