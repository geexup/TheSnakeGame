var express = require("express"),
	app = express(),

recordTable = [
];

var bodyParser = require('body-parser');

app.use(express.static("./html/"));
app.use(bodyParser.json());


app.post("/Results", function(req, res){
	console.log(recordTable);
	recordTable.push(req.body);
	recordTable = recordTable.sort(function(a, b){
		return a.score - b.score;
	}).reverse().slice(0,10);

	res.end("Done");
});

app.get("/Results", function(req, res){
	var tosend = recordTable.map(function(val){
		val.me = val.usrID == req.query.usr ? true : false;
		return val;
	});
	res.json(tosend);
});

app.listen(8080, function(){
	console.log("Application lives here - http://localhost:8080/");
});