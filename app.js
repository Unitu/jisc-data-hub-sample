// requirements
var express = require('express'),
path = require('path'),
session = require('express-session'),
bodyParser = require('body-parser'),
dataHub = require('./data-hub');

// server config
var app = express()
router = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	secret: 'data-hub-sample',
	resave: false,
	saveUninitialized: false
}));

// routes
router.get('/', function(req, res) {
	// check session token
	var sess = req.session;
	if (sess.token) {
		res.render('index', {token: sess.token});
	} else {
		res.redirect('/login');
		res.end();
	}
});
router.get('/login', function(req, res) {
	res.render('login');
});
router.post('/login', function(req, res) {
	// get attrs
	var email = req.body.email,
	password = req.body.password;

	// request a token
	dataHub.getToken(email, password, function(token) {
		if (token == null) {
			// back to login
			res.redirect('/login');
			res.end();
		} else {
			// store token and continue
			req.session.token = token;
			res.redirect('/');
			res.end();
		}
	});
});
router.get('/logout', function(req, res) {
	req.session.token = undefined;
	res.redirect('/login');
	res.end();
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
