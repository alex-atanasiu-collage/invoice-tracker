var express = require('express');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();

})

app.get('/', function(req, res) {
  res.json({notes: "Root mapping"})
});

app.get('/hello', function(req, res) {
  res.json({notes: "Hello, World, from API!"})
});



app.listen(3000);