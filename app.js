// requirements
var express = require('express'),
path = require('path'),
dataHub = require('./data-hub'),
app = express(),
router = express.Router();

// routes
router.get('/', function(req, res) {
	res.json(dataHub.getToken('a','b'));
});
app.use('/', router);

// squash favicon 404s
app.use('/favicon.ico', function(req, res) {res.end();});

// views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'static')));

// basic error handler
app.use(function(req, res, next) {
	var err = new Error('Not found');
	err.message = 'Not found';
	err.status = 404;
	next(err);
});
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	console.log(err);
	res.json(err);
});

// go!
app.listen(3000);
