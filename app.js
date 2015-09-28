var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;
var dbPath = 'mongodb://localhost/nodebackbone';

// Import the data layer
var mongoose = require('mongoose');
var config = {
	mail: require('.config/mail')
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
		secret: "ahsans secret",
		store: new MemoryStore()
	}));
	mongoose.connect(dbPath,function onMongooseError(err) {
		if (err)
			throw err;
	});
});

app.get('/', function(req, res){
	res.render("index.jade", {layout:false});
});

app.post('/login', function(req, res){
	console.log('login request');
	var email = req.param('email', null);
	
});

app.listen(8080);