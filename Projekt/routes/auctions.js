//jshint node: true, esversion: 6
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var ObjectId = require('mongodb').ObjectID;

var Auction = require('../models/auction.js');
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

router.get('/addauction',isAuthenticated, function (req, res) {
	res.render('addauction');
});

router.get('/auctions', function (req,res) {
    Auction.find(function (err, auctions) {
		if (auctions) {
			res.render('auctions', {auctions: auctions});
		}
		else {
			res.render('error',{ status: 404, url: req.url });
		}	
	});
});

router.get('/auction/:auctionId', function (req, res) {
    if(req.params.auctionId.length == 12 || req.params.auctionId.length == 24){
	    Auction.findOne({_id:ObjectId(req.params.auctionId)}, function (err, auction) {
		    if (auction) {
                User.findOne({_id:ObjectId(auction.ownerId)}, function (err, user) {
                    if(user){
                        res.render('auction', {auction: auction,user:user});
                    }
                    else{
                        res.render('error',{ status: 404, url: req.url });
                    }
                });
		    }
		    else {
                res.render('error',{ status: 404, url: req.url });
		    }	
        });
    }
    else
    {
        res.render('error',{ status: 404, url: req.url });
    }
});

module.exports = router;