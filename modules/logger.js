var fs = require("fs");

/** Class representing logger. */
function LOGGER(name, cnsl, path){
	this.name = name.toUpperCase();
	this.cnsl = cnsl ? cnsl : console;
	this.logs = [];
	this.path = typeof path !== "undefined" ? path : "./logs.txt";
}

LOGGER.prototype = {
	log:	log,
	error:	error,
	save:	save
};

function log(log, discription, err){
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

function error(log, discription){
	this.log(log, discription, true);
};

function save(callback){
	var textOLogs = "";
	
	this.logs.forEach(function(val){
		textOLogs = textOLogs + val + "\n";
	});

	fs.appendFile(this.path, textOLogs, null);
};

module.exports = LOGGER;