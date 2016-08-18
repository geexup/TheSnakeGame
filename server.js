var express = require("express"),
	app = express();

app.use(express.static("./html/"));

app.listen(8080, function(){
	console.log("Application lives here - http://localhost:8080/");
});