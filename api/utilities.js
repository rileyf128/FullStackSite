const express = require('express');
var bodyparser = require('body-parser');
var urlencodedParser = bodyparser.urlencoded({extended: false});
const bcrypt = require('bcrypt');
var mysql = require('mysql');
var xml2js = require('xml2js');
var fs = require('fs');
const router = express.Router();

var theInfo;
var theHost ;
var theUser ;
var thePassword;
var theDatabase;
var thePort;
var parser = new xml2js.Parser();	 

fs.readFile('./dbconfig.xml', function (err, data) {
	parser.parseString(data, function (err, result) {
		if (err) throw err;	
	
		theHost = result.dbconfig.host[0];
		theUser = result.dbconfig.user[0];
		thePassword = result.dbconfig.password[0];
		theDatabase = result.dbconfig.database[0];
		thePort = result.dbconfig.port[0];
		console.log()
	});
});
	console.log(theHost)

	 var connection = mysql.createConnection({
		host: "cse-mysql-classes-01.cse.umn.edu" ,
		user: "C4131S21U112",
		password: "12574", 
		database: "C4131S21U112", 
		port: thePort
	});
		connection.connect(function (err) {
		if (err) {
			throw err;
		};
		console.log("Connected to mysql");
	});

router.get('/logout', function (req, res) {
	if (!req.session.value) {
		res.send('Session not started, cannot logout');
	}
	else {
		console.log("Destroyed session");
		req.session.destroy();
		res.redirect('/login');	
		//res.send("Session complete");
	}
});

router.get('/contacts', function (req, res) {
    		connection.query("SELECT * FROM tbl_contacts", function (err, rows) {
    		console.log(rows)
			if(err) throw err;
			if (rows.length == 0) {
				console.log("No entries in table");
			}
			else {
				res.send(rows);
			}
		});
});
router.post('/loginAttempt', urlencodedParser, function (req, res) {
		var loginInfo = req.body;
		var login = loginInfo.login;
		var pwd = loginInfo.password;
		connection.query("SELECT * FROM tbl_accounts WHERE acc_login = ?", [login], (err, results) => { 
			if (err){
				throw err;
			}
			results = JSON.parse(JSON.stringify(results))
			if (results.length >= 1 & bcrypt.compareSync(pwd, results[0].acc_password)) {
				req.session.user = login; 
				req.session.value = 1;
				res.json({status: 'success'});
			}
			else {
				res.json({status: 'fail'});	
			}
		}	
	)});
	
router.post('/addContact', urlencodedParser, function (req, res) { //create 
	console.log("into add contact")
	var conInfo = req.body;
	var name = conInfo.name
	console.log(name); // make sure this was obtained correctly
	connection.query("SELECT * FROM tbl_contacts WHERE name = ?", [name],  function (err, rows) {
		if(err) throw err;
		if (rows.length == 0) {
			let rowToBeInserted = {
				name: conInfo.name,
				category: conInfo.cat,
				location: conInfo.loc,
				contact_info: conInfo.info,
				email: conInfo.email,
				website: conInfo.web,
			};
			connection.query('INSERT INTO tbl_contacts SET ?', rowToBeInserted, function (err, result) { 
	   			if (err) throw err;
			var response = {flag: true}
			res.send(response)
			});
		}
		else {
			var response = {flag: false}
			res.send(response);
		};
	  });
});

router.post('/deleteContact', urlencodedParser, function (req, res) {
	var info = req.body
	var name = info.name
	connection.query('DELETE FROM tbl_contacts where name = ?', [name], function (err) {
		if(err) throw err;
		var response = {flag: true}
		res.send(response);
		console.log("res sent")
	}
)});

router.post('/updateContact',urlencodedParser, function (req, res) {
	var conInfo = req.body;
	var name = conInfo.name
	console.log(name); // make sure this was obtained correctly
	connection.query("SELECT * FROM tbl_contacts WHERE name = ?", [name],  function (err, rows) {
		if(err) throw err;
		if (rows.length == 1) {
			var category = conInfo.cat
			var location = conInfo.loc
			var contact_info = conInfo.info
			var email = conInfo.email
			var website = conInfo.web
			connection.query("UPDATE tbl_contacts SET category = ?, location = ?, contact_info = ?, email = ?, website = ? WHERE name = ?", [category, location, contact_info, email, website, name], function (err, result) {
				if(err) throw err;
				console.log("made it past query")
				var response = {flag: true}
				res.send(response);
				console.log("editted")
			});
		}
		else {
			var response = {flag: false}
			res.send(response);
		};
	  });
});


module.exports = router;
