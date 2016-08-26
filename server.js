var express =		require("express");
var bodyParser =	require('body-parser');
var fs =			require("fs");
var app =			express();

var LOGGER = require("./modules/logger.js");
var RecordTable = require("./modules/RecordsTable.js");

var mainLogger =	new LOGGER("Server");
var recordLogger =	new LOGGER("RECORDS");
var recordTable =	new RecordTable(undefined, recordLogger);

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


process.on('SIGINT', function() {
	recordTable.saveRecords(function(){
		mainLogger.log("GoodBye!");
		process.exit();
	});
});