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
	// private api, only for logged in
	if(!checkLogin(req.session)){
		res.status(403);
		res.json({applicationData: null});
		return;
	}

	res.json({applicationData: appData});
});

expressApp.get('/users', function(req, res) {
	if(!checkLogin(req.session)){
		res.status(403);
		res.json({applicationData: null});
		return;
	}
	res.json({users: userList});
});

expressApp.get('/session', function(req, res) {
	if(!checkLogin(req.session)){
		res.status(403);
		res.json({applicationData: null});
		return;
	}
	
	res.json({users: req.session});
});


expressApp.post('/login', function(req, res) {
	if(!req.body.user || !req.body.password){
		res.json({loggedIn: false, error: 'No user/pass combination in body!'});
		return;	
	}

	if(userList[req.body.user]){
		if(userList[req.body.user].password == req.body.password){
			req.session.user = req.body.user;
			req.session.loggedIn = true;

			res.json({loggedIn: true, error: null});
		} else {
			res.json({loggedIn: false, error: 'Invalid password!'});
		}
	} else {
		res.json({loggedIn: false, error: 'No such username!'});
	}
});

expressApp.post('/logout', function(req, res) {
	req.session.user = null;
	req.session.loggedIn = false;

	res.json({message: 'Logout succeed!'});
});

expressApp.get('/checkLogin', function(req, res) {
	res.json({isLogged: req.session.loggedIn ? true : false});
});


function checkLogin(session){
	return session.loggedIn;
}

// start server listening on port 3000
expressApp.listen(3000);