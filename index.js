// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT
const createError = require('http-errors');

// Include the express module
const express = require('express');
var fs = require('fs');

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// Path module - provides utilities for working with file and directory paths.
const path = require('path');

// Helps in managing user sessions
const session = require('express-session');

// include the mysql module
var mysql = require('mysql');

// Bcrypt library for comparing password hashes
const bcrypt = require('bcrypt');

// Include the express router. 
const utilities = require('./api/utilities');

const port = 9001;

// create an express application
const app = express();

// Use express-session
// In-memory session is sufficient for this assignment


//uncommenting the below redirects all pages to login but it breaks the login function so it will remain commented 
/*app.use(function (req, res, next) {
	if(req.path == '/login') {
		next();
	}
	else if (req.session.value != 1) {
		res.redirect('/login');
	}
	else {
		next();	
	}
});*/

// middle ware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// server listens on port 9002 for incoming connections
app.listen(port, () => console.log('Listening on port', port));


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/welcome.html'));
});

// GET method route for the contacts page.
// It serves contact.html present in public folder
app.get('/contacts', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/contacts.html'));
});

app.get('/stock', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/stock.html'));
});

app.get('/addContact', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/addContact.html'));
    	
});
// TODO: Add implementation for other necessary end-points
app.get('/logout', function (req, res) {
	res.redirect('/api/logout');	
});
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/login.html')); 
});

app.get('/first', function (req, res) {
	console.log("Starting session");
	req.session.value = 1;
	res.send('Started session');	
});

app.get('/second', function (req, res) {
	console.log("Attempting to visit 2nd");
	if (!req.session.value) res.send('Session not started');
	else {
		console.log("Got to else in second");
		req.session.value += 1;
		var newVal = req.session.value;
		res.send('Session value: ' + newVal);
	} 	
});

// Makes Express use a router called utilities
app.use('/api', utilities);

// function to return the 404 message and error to client
app.use(function (req, res, next) {
    next(createError(404));
});


// error handle
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render('error');
    res.send();
}); 
