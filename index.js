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
		// connect to postgresql
		else if (jc.name === "Postgresql") {
			var pg = require('pg');
			var connString = 'postgres://' + jc.username + ':' + jc.password + '@localhost/' + jc.database;

			pg.connect(connString, function(err, client, done) {
			  if(err) {
			  	console.log(JSON.stringify(err));
			  	if (err.code === "28000") {
			  		console.log("Invalid username and password combination");
			  	} else if (err.code === "3D000") {
			  		console.log("Unable to connect to specified database");
			  	}
			  	done();
			  } else {
					console.log("Successfully connected to the database");

					// Get all table names in database
					client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';", function(err, result) {
						var table_names = [];
						result.rows.forEach(function(t) {
							table_names.push(t.table_name);
						});
						console.log(String(table_names));
					});
					done();
				}
			});
			pg.end();
		}
	})
	.parse(process.argv);