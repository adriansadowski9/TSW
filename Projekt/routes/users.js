//jshint node: true, esversion: 6
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

var User = require('../models/user.js');

var isAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
	  	return next();
	} else {
	  	res.redirect('/login');
	}
};
var isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
	  	res.redirect('/profile');
	} else {
	  	return next();
	}
};

// Register
router.get('/register', isLoggedIn, function (req, res) {
	res.render('register');
});

// Login
router.get('/login', isLoggedIn, function (req, res) {
	res.render('login');
});

router.get('/profile', isAuthenticated, function (req, res) {
	res.render('profile');
});

router.get('/editprofile', isAuthenticated, function (req, res) {
	res.render('editprofile');
});

router.get('/changepassword', isAuthenticated, function (req, res) {
	res.render('changepassword');
});

router.post('/editprofile', function (req,res) {
	var descriptionText = req.body.description;
	if(descriptionText){
		console.log(req.user.username);
		User.updateOne({username:{ "$regex": "^" + req.user.username + "\\b", "$options": "i"}},{$set:{description: descriptionText}}); // NIE DZIAŁA
		req.flash('success_msg', 'You successfuly edited your profile');
		res.redirect('/profile');
	}
	else
	{
		req.flash('error_msg', 'Something went wrong...');
		res.redirect('/profile');
	}
});

router.post('/changepassword', function (req,res) {
	var newPassword = req.body.password;
	req.checkBody('password', 'Password is required').notEmpty();
	if(newPassword){
		req.checkBody("password", "Password must include 8 characters with one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
		req.checkBody('password2', 'Passwords do not match').equals(newPassword);
	}
	var errors = req.validationErrors();
	if (errors) {
		res.render('changepassword', {
			errors: errors
		});
	}
	else{
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(newPassword, salt, function(err, hash) {
				newPassword = hash;
			});
		});
		console.log(newPassword); // NIE DZIAŁA HASH
		User.updateOne({username:{ "$regex": "^" + req.user.username + "\\b", "$options": "i"}},{$set:{password: newPassword}});
		req.flash('success_msg', 'You successfuly changed password');
		res.redirect('/profile');
	}
});

// Register User
router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var description = "My description";

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	if(name){
		req.checkBody('name', 'Name must include 4 characters').isLength({min:4});
	}
	req.checkBody('email', 'Email is required').notEmpty();
	if(email){
		req.checkBody('email', 'Email is not valid').isEmail();
	}
	req.checkBody('username', 'Username is required').notEmpty();
	if(username){
		req.checkBody('username', 'Username must include 4 characters').isLength({min:4});
	}
	req.checkBody('password', 'Password is required').notEmpty();
	if(password){
		req.checkBody("password", "Password must include 8 characters with one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
		req.checkBody('password2', 'Passwords do not match').equals(password);
	}

	var errors = req.validationErrors();
	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({ username: { 
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('register', {
						user: user,
						mail: mail
					});
				}
				else {
					var date = new Date();
					var newUser = new User({
						name: name,
						email: email,
						username: username,
						password: password,
						description: description,
						joined: date.toLocaleDateString()
					});
					console.log(newUser);
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         	req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/login');
				}
			});
		});
	}
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/profile', failureRedirect: '/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/profile');
	});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/login');
});

router.get('/user/:username', function (req, res) {
	User.findOne({ username: { "$regex": "^" + req.params.username + "\\b", "$options": "i"}}, function (err, user) {
		if (user) {
			res.render('user', {user: user});
		}
		else {
			res.render('error',{ status: 404, url: req.url });
		}	
	});
});

module.exports = router;