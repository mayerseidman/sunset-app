
'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const os = require('os');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json())
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

const fetch = require("node-fetch")
var MongoClient = require('mongodb').MongoClient;
var SunsetWx = require('node-sunsetwx');

const { getSunrise, getSunset } = require('sunrise-sunset-js')
var moment = require('moment');

app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.get('/api/extractText', function(req, res) {
	var imgName = req.query.imgName;
	console.log("EXTRACTTTTTTTTTTTTTTTT", imgName)

	const ocrSpaceApi = require('ocr-space-api');

	var options =  { 
	    apikey: '8f5d685ff588957',
	    language: 'por', // Português
	    imageFormat: 'image/png', // Image Type (Only png ou gif is acceptable at the moment i wrote this)
	    isOverlayRequired: true
	};

	// Image file to upload
	// Running off of my desktop for now....have to make this eventually read off database...
	const imageFilePath = "/Users/mayerseidman/Desktop/" + imgName + ""

	// Run and wait the result
	ocrSpaceApi.parseImageFromLocalFile(imageFilePath, options)
	  .then(function (parsedResult) {
	    console.log('parsedText: \n', parsedResult.parsedText);
	    res.send({ text: parsedResult.parsedText })
	    console.log('ocrParsedResult: \n', parsedResult.ocrParsedResult);
	  }).catch(function (err) {
	    console.log('ERROR:', err);
	  });

})

// app.post('api/send', function(req, res) {
//     var lat = req.body.lat,
// 	long = req.body.long;
// 	console.log(lat, long)
// });


app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));



// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
// const accountSid = 'ACa7a50c421d7be9a3e7ab894026d00460';
// const authToken = '44bae3f2f320dd1e74efb1dd5f0bf78f';
// const client = require('twilio')(accountSid, authToken);

// client.messages
//   .create({
//      body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
//      from: '+14123125983',
//      to: '+14124273243'
//    })
//   .then(message => console.log(message.sid));







var sunsetwx = new SunsetWx({
	email: 'mzseidman@gmail.com',
	password: 'Victory251',
});

function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date);
    newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return newDate;
}

app.post('/api/send', (req, res) => {
	var lat = req.body.lat,
	long = req.body.long;

	runIT(lat,long, (quality)=>{
		res.send({ quality })
		// const accountSid = 'ACa7a50c421d7be9a3e7ab894026d00460';
		// const authToken = '44bae3f2f320dd1e74efb1dd5f0bf78f';
		// const client = require('twilio')(accountSid, authToken);
		// var message = "QUALITY: " + quality.quality + "\n" + " Quality Percent: " + quality.quality_percent;

		// client.messages
		//   .create({
		//      body:  message,
		//      from: '+14123125983',
		//      to: '+14124273243'
		//    })
		//   .then(message => console.log(message.sid));
	})
	
});

// function grabValue(value) {
// 	console.log(value.quality_percent)
// 	return value.quality_percent;
// }

function runIT(lat, long, callback) {
	var coordsString = '' + long + ',' + lat + '';
	sunsetwx.quality({
	    coords: coordsString,
	    type: 'sunset',
	    radius: '1',
	    limit: '1'
	}, function (err, httpResponse, body) {
		if (callback) {
			callback(body.features[0].properties);		
		}
	});

	const sunsetTime = getSunset(lat, long);
	var date = convertUTCDateToLocalDate(new Date(sunsetTime));
	// var date = new Date(sunsetTime + 'UTC');
	// console.log(date.toString())

}


// Connect to the db
// MongoClient.connect("mongodb://localhost:27017/MyDb", function (err, db) {  
// 	if(err) throw err;
// 	db.collection('Persons', function (err, collection) {    
// 	    collection.insert({ id: 1, firstName: 'Steve', lastName: 'Jobs' });
// 	    collection.insert({ id: 2, firstName: 'Bill', lastName: 'Gates' });

// 	    db.collection('Persons').count(function (err, count) {
// 	        if (err) throw err;
	        
// 	        console.log('Total Rows: ' + count);
// 	    });
// 	});
//      //Write databse Insert/Update/Query code here..              
// });













