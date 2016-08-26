var express =		require("express");
var bodyParser =	require('body-parser');
var fs =			require("fs");
var app =			express();
var recordTable =	new RecordsTable();
var mainLogger =	new LOGGER("Web Server");


function LOGGER(name, cnsl){
	this.name = name.toUpperCase();
	this.cnsl = cnsl ? cnsl : console;
	this.logs = [];
	this.path = "./logs.txt";
}

LOGGER.prototype.log = function(log, discription, err){
	var d = new Date();
	var time = d.toTimeString().slice(0,8);
	var text = time + " [" + this.name + "]	" + log + ( typeof discription !== "undefined" ? " (" + discription + ")" : "" );
	
	if(!err){
		this.cnsl.log(text);
		this.logs.push(d.toDateString() + " log: " + text);
	}
	else{
		this.cnsl.error(text);
		this.logs.push(d.toDateString() + " err: " + text);
	}

	this.save();
};

LOGGER.prototype.error = function(log, discription){
	this.log(log, discription, true);
};

LOGGER.prototype.save = function(callback){
	var textOLogs = "";
	
	this.logs.forEach(function(val){
		textOLogs = textOLogs + val + "\n";
	});

	fs.appendFile(this.path, textOLogs, null);
};


function RecordsTable(){
	this.records =	[];
	this.logger =	new LOGGER("RECORDS");
	this.path =		"./records.json";

	if(RecordsTable.instance)
		return RecordsTable.instance;

	RecordsTable.instance = this;
}

RecordsTable.prototype.setRecord = function(newRecord){
	this.records.push(newRecord);
	this.records = this.records.sort(function(a, b){
		return a.score - b.score;
	}).reverse().slice(0,10);

	this.logger.log("New Record Setted", newRecord.score);

	this.saveRecords(function(){
		return this.records;
	});
};

RecordsTable.prototype.getRecords = function(userID){
	var recordsByUser = this.records.map(function(val){
		val.me = val.usrID == userID ? true : false;
		return val;
	});

	return recordsByUser;
};

RecordsTable.prototype.saveRecords = function(callback){
	var recordsToFile = JSON.stringify(this.records);
	var _resultsTable = this;

	fs.writeFile(this.path, recordsToFile, function(err) {
    	if(!err) {
    		_resultsTable.logger.log("Saved");
    		callback();
    	}
	}); 
};

RecordsTable.prototype.loadRecords = function(callback){
	var _resultsTable = this;

	fs.readFile('./records.json', 'utf8', function (err,data) {
  		if (!err) {
  			_resultsTable.records = JSON.parse(data);
  			_resultsTable.logger.log("Loaded", "Count:" + _resultsTable.records.length);
  			callback(_resultsTable.records);
  		}
  	});
};

app.use(express.static("./html/"));
app.use(bodyParser.json());

app.post("/Results", function(req, res){
	recordTable.setRecord(req.body);
	res.end("Done");
});

app.get("/Results", function(req, res){
	var toSend = recordTable.getRecords(req.query.usr);
	res.json(toSend);
});


recordTable.loadRecords(function(){
	app.listen(8080, function(){
		mainLogger.log("Started", "http://localhost:8080/");
	});
});
