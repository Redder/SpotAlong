var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

//Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
	res.render('public/index.html');
});

app.listen(3000);
console.log('Server running in port 3000');
