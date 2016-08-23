var express = require("express"),
	app = express(),

recordTable = [
];

var bodyParser = require('body-parser');

app.use(express.static("./html/"));
app.use(bodyParser.json());


app.post("/Results", function(req, res){
	console.log(req.body);
	recordTable.push(req.body);
	res.end("wdawd");
});

app.get("/Results", function(req, res){
	var tosend = recordTable.sort(function(a, b){
		return a.score - b.score;
	}).map(function(val){
		val.me = val.usrID == req.query.usr ? true : false;
		return val;
	});
	res.json(tosend);
})

app.listen(8080, function(){
	console.log("Application lives here - http://localhost:8080/");
});