
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

function doSomething() {
	console.log("!!")
}
// var users = ["a", "b", "c", "d", "e", "f", "g", "h", "j", "k", "l", "m"]
// var usersLength = users.length;
// var userLimit = 6;

// for (var i = 0; i < usersLength; i += userLimit) {
// 	var batch = _.first(users, userLimit);
// 	doSomething()
// 	console.log(users)
// 	users.splice(0, userLimit);
// 	console.log(users)
//


// Cron SMS Job
var url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
var job = new CronJob('0 12 * * *', function() { 
	mongodb.MongoClient.connect(url, (err, client)=>{
		const  db = client.db('heroku_9v9cjldm') 
		var users = db.collection('users')
		users.countDocuments({}, function (error, count) {
			var userCount = count;
			var userLimit = 10;
			users.find().toArray().then((result)=>{
				for (var i = 0; i < userCount; i += userLimit) {
					var batchUsers = _.first(result, userLimit);
					console.log(batchUsers.length)
					setTimeout(function() {
						batchUsers.forEach(user => {
							var lat = user.lat;
							var long = user.long;
							console.log(user.phone_number)
							fetchFromSunsetWX(lat, long).then((sunset) => {
								console.log(sunset.quality_percent)
								const phoneNumber = user.phone_number;
								const locale = geoTz(lat, long)[0];
								const momentDate = moment(sunset.valid_at).tz(locale).format("H:mm")
								const message = `Your SUNS°ET Forecast:\n\nTime: ${momentDate}\nQuality: ${sunset.quality} (${sunset.quality_percent}%)\nTemperature: ${Math.floor(sunset.temperature)}°`;
								twilioClient.messages
					  			.create({
					  				body: message,
					    			from: process.env.PHONE_NUMBER,
					    			to: phoneNumber
								})
								.then(message => console.log("IT WORKED: ", message.subresourceUris.media)); 		
							})	
						})
						result.splice(0, userLimit);
					}.bind(this), 2000);
				}
			})
		});
	});		
}, null, true, 'America/Los_Angeles')
job.start()

function checkForExistingUsers(phoneNumber) {
	return new Promise((resolve, reject) => {
		MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017', (err, client)=>{
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
	console.log("show me something")
	var lat = req.body.lat;
	var long = req.body.long;
	fetchFromSunsetWX(lat, long).then((sunset) => {
		res.send({ sunset })
	})
});

function sendIntroText(phoneNumber) {
	const message = "Thank you for signing up for daily SUNS°ET forecasts. \n\nText 'Stop' at any time to stop receving these. \n\nHave a fab day!"
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
	const location = req.body.user.location;
	const lat = req.body.user.lat;
	const long = req.body.user.long;

	checkForExistingUsers(phoneNumber).then(function(result) {
		console.log("result:", result)
		if (!result) {
			res.send({ error: true });
		} else {
			MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017', (err, client) => {
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
})