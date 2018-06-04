//jshint node: true, esversion: 6
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var ObjectId = require('mongodb').ObjectID;
var moment = require('moment');
var cron = require('node-cron');
var Handlebars = require('handlebars');

var Auction = require('../models/auction.js');
var User = require('../models/user.js');

cron.schedule('* * * * *', function(){
	time = moment().format("Do MMMM YYYY h:mm a");
	Auction.updateMany({ end: {$lt:time}},{$set:{ended:true}}, function(err,auctionTest){
		console.log(auctionTest);
	});
});
cron.schedule('* * * * *', function(){
	time = moment().format("Do MMMM YYYY h:mm a");
	Auction.updateMany({ listedTime: {$lt:time}},{$set:{listed:true}}, function(err,auctionTest){
		console.log(auctionTest);
	});
});
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
    Auction.find({listed:true,ended:false},function (err, auctions) {
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

router.get('/editauction/:auctionId',isAuthenticated, function (req, res) {
    if(req.params.auctionId.length == 12 || req.params.auctionId.length == 24){
	    Auction.findOne({_id:ObjectId(req.params.auctionId)}, function (err, auction) {
		    if (auction) {
				if(auction.ownerId == req.user._id){
					var typeAuctionTest = false;
					var typeBuyNowTest = false;
					if(auction.listedType == "auction"){
						typeAuctionTest = true;
					}
					else{
						typeBuyNowTest = true;
					}
					res.render('editauction', {auction: auction,listedType:{typeAuction:typeAuctionTest,typeBuyNow:typeBuyNowTest}});
				}
				else{
					res.render('error',{ status: 404, url: req.url });	
				}
			}
			else{
				res.render('error',{ status: 404, url: req.url });
			}
        });
	}
	else{
        res.render('error',{ status: 404, url: req.url });
	}	
});

router.post('/addauction', function (req, res) {
	var name = req.body.name;
	var description = req.body.description;
	var price = req.body.price;
	var listedType = req.body.listedType;
	var wait = req.body.wait;
	var listTime = req.body.listTime;

	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('description', 'Description is required').notEmpty();
	req.checkBody('price','Price must look like: 199.99 ').matches(/[1-9]\d{0,7}(?:\.\d{1,2})?$/,"i");

	var errors = req.validationErrors();
	if (errors) {
		res.render('addauction', {
			errors: errors
		});
	}
	else{
		var newAuction = new Auction({
			name: name,
			description: description,
			price: price,
			listedType: listedType,
			created: moment().format("Do MMMM YYYY h:mm a"),
			listedTime: moment().add(wait,'m').format("Do MMMM YYYY h:mm a"),
			end: moment().add(listTime,'days').format("Do MMMM YYYY h:mm a"),
			ownerId: req.user._id,
			listed: false,
			ended: false
		});
		Auction.createAuction(newAuction, function (err, auction) {
			if (err) throw err;
		});
 		req.flash('success_msg', 'You successfully added an auction');
		res.redirect('/profile');
	}
});

router.post('/editauction/:auctionId', function (req, res) {
	var name = req.body.name;
	var description = req.body.description;
	var price = req.body.price;
	var listedType = req.body.listedType;

	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('description', 'Description is required').notEmpty();
	req.checkBody('price','Price must look like: 199.99 ').matches(/[1-9]\d{0,7}(?:\.\d{1,2})?$/,"i");

	var errors = req.validationErrors();
	if (errors) {
		res.render('editauction', {
			errors: errors
		});
	}
	else{
		Auction.updateOne({_id:ObjectId(req.params.auctionId)},{$set:{name: name,description: description,price: price,listedType: listedType}},function (err, auctionEdit){
			if (err){
				req.flash('error_msg', 'Something went wrong...');
				res.redirect('/profile');
				throw err;
			}
			else{
				req.flash('success_msg', 'You successfuly edited your auction');
				res.redirect('/profile');
			}
		});
	}
});


Handlebars.registerHelper('dividedby3', function(arg1, options) {
    return (((arg1 + 1) % 4) == 0) ? options.fn(this) : options.inverse(this);
});

module.exports = router;