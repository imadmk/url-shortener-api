'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var MongoClient = require('mongodb').MongoClient;

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
		
	app.route(/\/new\/.+/)
		.get( function (req, res) {
			var match = req.path.match(/^\/new\/(.+)/);
			var url = match[1];
			var isValid = /^\D.+\:/.test(url);
			
			console.log("=========")
			console.log(url);
			console.log('---------')
			
			var dburl = process.env.MONGO_URI;
			
			if (isValid) {
				var length, shortUrl;
				console.log('valid');
				MongoClient.connect(dburl, function (err, db) {
					if (err) throw err;
					
					var collection = db.collection('shorts');
					
					collection.find({url:url}).toArray(function (err, item) {
						if (err) throw err;
						
						var isExist = (item.length == 0) ? false : true;
						
						if (!isExist) {
							collection.count(function (err, count) {
								console.log('not exist');
								length = count+1;
								
								collection.insertOne(
									{
										url: url,
										short: length
									}, function (err, result) {
										
										var jsonSent = {
											original_url: url,
											short_url: req.hostname + "/" + length
										};
										res.json(jsonSent);
									}
								);
							}); // end count
						} else {
							console.log('exist');
							var jsonSent = {
								original_url: item[0].url,
								short_url: req.hostname + "/" + item[0].short
							};
							res.json(jsonSent);
						}
					}); // end find
				}); // end connect
				
			} else {
				console.log('not valid');
				var jsonSent = {
					error: "url is not valid"
				}
				res.json(jsonSent);
			} // end valid
		}); // end route new
		
	app.route('/:short')
		.get(function (req, res) {

			var dburl = process.env.MONGO_URI;
			MongoClient.connect(dburl, function (err, db) {
				if (err) throw err;
					
				var collection = db.collection('shorts');
				var short = parseInt(req.path.match(/\d+/)[0]);
				
				collection.find({short:short}).toArray(function (err, item) {
					if (err) throw err;

					var isExist = (item.length == 0) ? false : true;
					
					if (isExist) {
						console.log('exist');
						var url = item[0].url;
						res.redirect(url);
					} else {
						console.log('not exist');
						res.end();
					}
				});
			
			});
		});
};
