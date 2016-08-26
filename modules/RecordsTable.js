var fs = require("fs");

/** Class representing record controll functional. */
function RecordsTable(path, LOGGER){
	this.records =	[];
	this.logger =	LOGGER;
	this.path =		typeof path !== "undefined" ? path : "./records.json";

	if(RecordsTable.instance)
		return RecordsTable.instance;

	RecordsTable.instance = this;
}

RecordsTable.prototype = {
	setRecord:		setRecord,
	getRecords:		getRecords,
	saveRecords:	saveRecords,
	loadRecords:	loadRecords
};

function setRecord(newRecord){
	this.records.push(newRecord);
	this.records = this.records.sort(function(a, b){
		return a.score - b.score;
	}).reverse().slice(0,10);

	this.logger.log("New Record Setted", newRecord.score);

	this.saveRecords(function(){
		return this.records;
	});
};

function getRecords(userID){
	var recordsByUser = this.records.map(function(val){
		val.me = val.usrID == userID ? true : false;
		return val;
	});

	return recordsByUser;
};

function saveRecords(callback){
	var recordsToFile = JSON.stringify(this.records);
	var _resultsTable = this;

	fs.writeFile(this.path, recordsToFile, function(err) {
    	if(!err) {
    		_resultsTable.logger.log("Saved");
    		callback();
    	}
	}); 
};

function loadRecords(callback){
	var _resultsTable = this;

	fs.readFile('./records.json', 'utf8', function (err,data) {
  		if (!err) {
  			_resultsTable.records = JSON.parse(data);
  			_resultsTable.logger.log("Loaded", "Count:" + _resultsTable.records.length);
  			callback(_resultsTable.records);
  		}
  	});
};

module.exports = RecordsTable;