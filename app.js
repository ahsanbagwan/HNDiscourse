var express = require('express');

// add new way of starting server
var app = express();
var nodemailer = require('nodemailer');
//var MemoryStore = require('connect').session.MemoryStore;
var fs = require('fs');
var dbPath = 'mongodb://localhost/nodebackbone';
var events = require('events');

// Import the data layer
var mongoose = require('mongoose');
var config = {
	mail: require('./config/mail')
};

// Import the models
var models = {
	Account: require('./models/Account')(config, mongoose, nodemailer)
};

app.configure(function() {
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
	app.use(express.limit('1mb'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: "ahsans secret"
		//,store: new MemoryStore()
	}));
	mongoose.connect(dbPath,function onMongooseError(err) {
		if (err)
			throw err;
	});
});

app.get('/', function(req, res){
	console.log("In route /");
	res.render("index.jade");
});

app.post('/login', function(req, res){
	console.log('login request');
	var email = req.param('email', null);
	var password = req.param('password', null);

	if (null == email || email.length < 1 || null == password || password.length < 1) {
		res.send(400);
		return;
	}

	models.Account.login(email, password, function(account) {
		if (!account) {
			res.send(401);
			return;
		}
		console.log("login was successful");
		req.session.loggedIn = true;
		req.session.accountId = account._id;
		res.send(200);

	}); 
});

app.get('/account/authenticated', function(req, res){
	if (req.session.loggedIn){
		res.send(200);
	} else {
		res.send(401);
	}	
});

app.post('/register', function(req, res){
	var firstName = req.param('firstName', '');
	var lastName = req.param('lastName', '');
	var email = req.param('email', null);
	var password = req.param('password', null);

	if (null == email || email.length < 1 || null == password || password.length < 1) {
		res.send(400);
		return;
	}

	models.Account.register(email, password, firstName, lastName);
	res.send(200);

});

app.post('/forgotpassword', function(req, res){
	var hostname = req.headers.host;
	var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
	var email = req.param('email', null);
	if ( null == email || email.length < 1) {
		res.send(400);
		return;
	} 

	models.Account.forgotPassword(email, resetPasswordUrl, function(success){
		if (success){
			res.send(200);
		} else {
			res.send(404);	
		}
	});
});

app.get('/resetPassword', function(req, res){
	var accountId = req.param('account', null);
	res.render('resetPassword.jade', {locals:{accountId:accountId}});
});

app.post('/resetPassword', function(req, res){
	var accountId = req.param('accountId', null);
	var password = req.param('password', null);
	if (null != accountId && null != password) {
		models.Account.changePassword(accountId, password);
	}
	res.render('resetPasswordSuccess.jade');
});

app.listen(8080);
console.log('Server is listening on port 8080');