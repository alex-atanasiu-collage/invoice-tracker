/*
 * 
 */

// ========================= require modules =========================
var express = require('express');
var expressSession = require("express-session");
var firebaseAdmin = require('firebase-admin');
var bodyParser = require('body-parser');
var randomstring = require("randomstring");

// configure firebase (generated from Google API Dashboard)
var serviceAccount = require("invoice-tracker-803a2656f4ed.json");

// ========================= firebase initialize DB =========================
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://invoice-tracker-1cc5a.firebaseio.com"
});


// ========================= create cache to database =========================
var database = firebaseAdmin.database();
var applicationRef = database.ref("/Application");

var appData = null;
applicationRef.on("value", function(snapshot) {
  appData = snapshot.val();
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// ========================= create user cache to database =========================
var usersRef = database.ref("/Users");
var userList = null;
usersRef.on("value", function(snapshot) {
  userList = snapshot.val();
  console.log(userList);
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// ========================= configuring express =========================
var expressApp = express();
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json())
expressApp.use(expressSession({secret: 'session-secret'}));
expressApp.use(function(req, res, next) {
	// add cross origin request suport
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
})

// ========================= api calls =========================
expressApp.get('/application', function(req, res) {
	res.json({applicationData: appData});
});

expressApp.get('/users', function(req, res) {
	res.json({users: userList});
});

expressApp.get('/session', function(req, res) {
	res.json({users: req.session});
});

expressApp.get('/invoice/:invoiceid', function(req, res) {
	// check login
	if(!checkLogin(req.session)){
		res.status(403);
		res.json({applicationData: null});
		return;
	}

	var invoiceId = req.params.invoiceid; // given by param

	// TODO look after object in firebase

	// TODO put result in res or null if there aren't any
	res.json(null);
});

expressApp.get('/invoices', function(req, res) {
	// check login
	if(!checkLogin(req.session)){
		res.status(403);
		res.json({applicationData: null});
		return;
	}

	// TODO get all invoices from firebase and return them
	res.json(null);
});


expressApp.post('/addinvoice', function(req, res) {
	// check login
	if(!checkLogin(req.session)){
		res.status(403);
		res.json({applicationData: null});
		return;
	}

	var invoice = req.body.invoice;

	// TODO add via firebase the invoice

	// TODO add add status
	res.json(null);
});


function checkLogin(session){
	return session.loggedIn;
}

// start server listening on port 3000
expressApp.listen(3000);