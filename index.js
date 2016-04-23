#!/usr/bin/env node
var program = require('commander'),
		fs = require("fs");

program
	.version('0.0.1')
	.arguments('<file>')
	.option('-c, --connect', 'Connect to a database')
	.action(function(file) {
		var config = fs.readFileSync(file);
		var jc = JSON.parse(config);

		//check for correct formatting of config file
		if (!jc.name || !jc.port || !jc.username || !jc.password) {
			console.log("Incorrectly formatted config file");
		} 
		// check for supported database
		else if (jc.name !== "MongoDB" && jc.name !== "Postgresql") {
			console.log("Unsupported Database: Currently supporting MongoDB and Postgresql");
		} 
		else if (jc.name === "Postgresql") {
			var pg = require('pg');
			var connectionString = 'postgres://' + jc.username + ':' + jc.password + '@localhost/' + jc.database;

			pg.connect(conString, function(err, client, done) {
			  if(err) {
			  	console.log("There was an error connecting to the database");
			  }
			  console.log("Successfully connected to the database");
			});
		}
	})
	.parse(process.argv);