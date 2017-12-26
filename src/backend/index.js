/*
 * 
 */

// require modules
var express = require('express');
var firebaseAdmin = require('firebase-admin');

// configure firebase (generated from Google API Dashboard)
var serviceAccount = require("invoice-tracker-803a2656f4ed.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://invoice-tracker-1cc5a.firebaseio.com"
});

// create cache to database
var database = firebaseAdmin.database();
var ref = database.ref("/Application");

var data = null;
ref.on("value", function(snapshot) {
  data = snapshot;
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});


// configuring express
var expressApp = express();
expressApp.use(function(req, res, next) {
	// add cross origin request suport
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
})


// api calls
expressApp.get('/hello', function(req, res) {
	res.json({notes2: data});
});

// start server listening on port 3000
expressApp.listen(3000);