
'use strict';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
const fetch = require("node-fetch")

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const SunsetWx = require('node-sunsetwx');
const geoTz = require('geo-tz')
const moment = require('moment');

const schedule = require('node-schedule');
const CronJob = require('cron').CronJob;
const _ = require('underscore')
require('dotenv').config();

const path = require('path');
app.listen(process.env.PORT || 8080, () => console.log("Shemesh APP Running"));

// Run the app and set its root // 
const distPath = path.join(__dirname, '../..', 'dist')
app.use(express.static(distPath))

app.get("/", (req, res) => {
	res.sendFile(path.join(distPath, 'index.html'))
})

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken); 

// SUNSETWX credentials
const sunsetwx = new SunsetWx({
	email: process.env.EMAIL,
	password: process.env.PASSWORD
});

function findLong(long, timezone) {
	var inRange = false;
	switch(timezone) {
		case EST:
			inRange = long >= -86 && long <= -69;
			break;
		case CT:
			inRange = long > -103 && long <= -87;
			break;
		case MT:
			inRange = long > -114 && long <= -103;
			break;
		case PST:
	    	inRange = long <= -114;
	    	break;
	    case EURO:
	    	inRange = long > -9.5 && long < 36;
	    	break;
	    case SEA:
	    	inRange = long > 36 && long < 120;
	    	break;
	    case AUS:
	    	inRange = long > 120 && long < 135;
	    	break;
	}
	return inRange
}

function sendSMS(users, timezone) {
	users.countDocuments({}, function (error, count) {
		var userCount = count;
		users.find().toArray().then((result)=>{
			result.forEach(user => {
				var i = result.indexOf(user);
				// Stagger the api calls so that do not hit limit 
				setTimeout(function() {
					var lat = user.lat;
					var long = user.long;
					var includesLong = findLong(long, timezone);
					if (includesLong) {
						console.log(user.phone_number)
						fetchFromSunsetWX(lat, long).then((sunset) => {
							const phoneNumber = user.phone_number;
							console.log(lat, long, phoneNumber)
							const locale = geoTz(lat, long)[0];
							const momentDate = moment(sunset.valid_at).tz(locale).format('h:mm a');
					    	if (lat < 49) {
								const celsius = Math.round(sunset.temperature);
								const fahrenheit = Math.round(( (9 * celsius) + 160 ) / 5)
								var temperature = fahrenheit;
							} else {
								var temperature = Math.round(sunset.temperature);
							}
							const message = `Your SUNS°ET Forecast:\n\nTime: ${momentDate}\nQuality: ${sunset.quality} (${Math.round(sunset.quality_percent)}%)\nTemperature: ${temperature}°`;
							twilioClient.messages
				  			.create({
				  				body: message,
				    			from: process.env.PHONE_NUMBER,
				    			to: phoneNumber
							})
							.then(message => console.log("IT WORKED: ", message.subresourceUris.media)); 		
						})	
					}	
				}.bind(this), i * 200);
			})
		})
	});
}

// Cron SMS Jobs
var url = process.env.MONGO_CLUSTER_URI || 'mongodb://localhost:27017';

// EST Cron Job - South Bend, IA to Bangore, ME
var job = new CronJob('00 09 * * *', function() { 
	mongodb.MongoClient.connect(url, (err, client)=>{
		const  db = client.db('heroku_9v9cjldm') 
		var users = db.collection('users')
		sendSMS(users, EST)
	});		
}, null, true, 'America/Los_Angeles')
job.start()

CT Cron Job - Chicago, IL to Lincoln, NE
var job = new CronJob('00 10 * * *', function() { 
	mongodb.MongoClient.connect(url, (err, client)=>{
		const  db = client.db('heroku_9v9cjldm') 
		var users = db.collection('users')
		sendSMS(users, CT)
	});		
}, null, true, 'America/Los_Angeles')
job.start()

// MT Cron Job - Eskdale, UT to Alliance, NE
var job = new CronJob('00 11 * * *', function() { 
	mongodb.MongoClient.connect(url, (err, client)=>{
		const  db = client.db('heroku_9v9cjldm') 
		var users = db.collection('users')
		sendSMS(users, MT)
	});		
}, null, true, 'America/Los_Angeles')
job.start()

// PST Cron Job - Baker, NV Westwards
var job = new CronJob('00 12 * * *', function() { 
	mongodb.MongoClient.connect(url, (err, client)=>{
		const  db = client.db('heroku_9v9cjldm') 
		var users = db.collection('users')
		sendSMS(users, PST)
	});		
}, null, true, 'America/Los_Angeles')
job.start()

// EUROPE
var job = new CronJob('00 03 * * *', function() { 
	mongodb.MongoClient.connect(url, (err, client)=>{
		const  db = client.db('heroku_9v9cjldm') 
		var users = db.collection('users')
		sendSMS(users, EURO)
	});		
}, null, true, 'America/Los_Angeles')
job.start()

// AUS
var job = new CronJob('00 19 * * *', function() { 
	mongodb.MongoClient.connect(url, (err, client)=>{
		const  db = client.db('heroku_9v9cjldm') 
		var users = db.collection('users')
		sendSMS(users, AUS)
	});		
}, null, true, 'America/Los_Angeles')
job.start()

// SEA
var job = new CronJob('00 21 * * *', function() { 
	mongodb.MongoClient.connect(url, (err, client)=>{
		const  db = client.db('heroku_9v9cjldm') 
		var users = db.collection('users')
		sendSMS(users, SEA)
	});		
}, null, true, 'America/Los_Angeles')
job.start()

function checkForExistingUsers(phoneNumber) {
	return new Promise((resolve, reject) => {
		MongoClient.connect(process.env.MONGO_CLUSTER_URI || 'mongodb://localhost:27017', (err, client)=>{
			let  db = client.db('heroku_9v9cjldm') 
			let users = db.collection('users')

			let findPhoneNumber = users.findOne({ phone_number: phoneNumber })

			findPhoneNumber.then((doc) => {
				resolve(_.isEmpty(doc))
			}).catch(err=>reject(err))
		})
	})
}

function fetchFromSunsetWX(lat, long) {
	return new Promise((resolve, reject) => {
		const coordsString = '' + lat + ',' + long + '';
	    sunsetwx.quality({
	        geo: coordsString,
	        type: 'sunset',
	        limit: '1'
	    }, function (err, httpResponse, body) {
			console.log(err, body)
			resolve(body.features[0].properties);		
	    });
	});
}

app.post('/api/fetch-sunset', (req, res) => {
	var lat = req.body.lat;
	var long = req.body.long;
	fetchFromSunsetWX(lat, long).then((sunset) => {
		res.send({ sunset })
	})
});

function sendIntroText(phoneNumber) {
	const message = "Thank you for signing up for daily SUNS°ET forecasts. \n\nText 'Stop' at any time to stop receving these. \n\nHave a lovely day!"
 	twilioClient.messages
		.create({
 			body: message, 
 			from: process.env.PHONE_NUMBER,
 			to: phoneNumber
 		})
 	.then(message => console.log("IT WORKED: ", message.subresourceUris.media));
}

app.post('/api/create-user', function (req, res) {
	const phoneNumber = "+1" + req.body.user.phone_number;
	const lat = req.body.user.lat;
	const long = req.body.user.long;
	console.log(lat, long, phoneNumber)
	checkForExistingUsers(phoneNumber).then(function(result) {
		console.log("result:", result)
		if (!result) {
			res.send({ error: true });
		} else {
			MongoClient.connect(process.env.MONGO_CLUSTER_URI || 'mongodb://localhost:27017', (err, client) => {
				let  db = client.db('heroku_9v9cjldm') 
				let users = db.collection('users')
				 
				users.insertOne({ id: Math.random(), phone_number: phoneNumber, lat: lat, long: long }, (err, result)=>{
					if(err)  {
						console.log('error inserting', result)
				 	} else {
				 		console.log("data inserted", result)
				 		sendIntroText(phoneNumber)
				 	}
				})   
		   	});
			res.send(req.body)
		}
	});
		// MongoClient.connect(process.env.MONGO_CLUSTER_URI || 'mongodb://localhost:27017', (err, client) => {
		// 	let  db = client.db('heroku_9v9cjldm') 
		// 	let users = db.collection('users')
			 
		// 	users.insertOne({ id: Math.random(), phone_number: phoneNumber, lat: lat, long: long }, (err, result)=>{
		// 		if(err)  {
		// 			console.log('error inserting', result)
		// 	 	} else {
		// 	 		console.log("data inserted", result)
		// 	 	}
		// 	})   
	 //   	});
		// res.send(req.body)
})

const EST = "EST";
const CT = "CT";
const MT = "MT";
const PST = "PST";
const EURO = "EURO";
const SEA = "SEA";
const AUS = "AUS";