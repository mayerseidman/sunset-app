
'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const os = require('os');

const express = require('express');
const bodyParser = require('body-parser');
const appDb = require('monk')('localhost/MyDb');
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

const fetch = require("node-fetch")
var MongoClient = require('mongodb').MongoClient;
var SunsetWx = require('node-sunsetwx');

const { getSunrise, getSunset } = require('sunrise-sunset-js')
var moment = require('moment');
var NodeGeocoder = require('node-geocoder');

var schedule = require('node-schedule');
var mongodb = require('mongodb');

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

// function runCron() {
// 	schedule.scheduleJob('30 * * * *', function(){
// 		console.log('People Can Feel PERFECTION BITCH');
// 	});
// }



// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'ACa7a50c421d7be9a3e7ab894026d00460';
const authToken = '44bae3f2f320dd1e74efb1dd5f0bf78f';
const client = require('twilio')(accountSid, authToken);

schedule.scheduleJob('32 * * * *', function(){
	const users = appDb.get('users')
	users.find().then((result)=>{
		console.log("Result from MONK", result[0].phone_number)

		result.forEach(user => {
			let phoneNumber = user.phone_number;
			client.messages
		  	.create({
		     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
		     from: '+14123125983',
		     to: phoneNumber
		   })
		  .then(message => console.log(message.sid));
		})
		
	})
});


app.listen(process.env.PORT || 8080, () => console.log(33));

// console.log(`Listening on port ${process.env.PORT || 8080}!`)








var sunsetwx = new SunsetWx({
	email: 'mzseidman@gmail.com',
	password: 'Victory251',
});

function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date);
    newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return newDate;
}

// San Diego = 32.7157, -117.1611

app.post('/api/send', (req, res) => {
	var lat = req.body.lat,
	long = req.body.long;

	 runIT(lat, long, (quality)=>{
		res.send({ quality })
		// const accountSid = 'ACa7a50c421d7be9a3e7ab894026d00460';
		// const authToken = '44bae3f2f320dd1e74efb1dd5f0bf78f';
		// const client = require('twilio')(accountSid, authToken);
		// var message = "QUALITY: " + quality.quality + "\n" + " Quality Percent: " + quality.quality_percent;

		// client.messages
		//   .create({
		//      body:  message,
		//      from: '+14123125983',
		//		mediaUrl: ['https://demo.twilio.com/owl.png'],
		//      to: '+14124273243'
		//    })
		//   .then(message => console.log(message.sid));
	})

	// NODE SCHEDULE BELOW

	// var j = schedule.scheduleJob('15 * * * *', function(){
	//   console.log('People Can Feel PERFECTION BITCH');
	// });

	// schedule.scheduleJob('25 * * * *', function(){
	// 	console.log('People Can Feel PERFECTION BITCH');
	// })

	// schedule.scheduleJob({ hour: 12, minute: 00 }, function(){
	//   console.log('Time for tea Binch!');
	// });
});

// var dbConn = mongodb.MongoClient.connect('mongodb://localhost:27017', (err, client)=>{

// });

// users.insert({ id: 1, phone_number: phoneNumber, location: location }).then((result) => {
// 	console.log("data inserted", result)
// }).catch(err=> console.log('error inserting') );

// geocoder.geocode('29 champs elysée paris', function(err, res) {
//   console.log("something paris ", err);
// });

app.use((req, res, next) => {
	req.db = appDb;
	next();
})

app.post('/api/submit-form', function (req, res) {
	var phoneNumber = "+1" + req.body.user.phone_number;
	var location = req.body.user.location;
	var lat = req.body.user.lat;
	var long = req.body.user.long;
	
	const users = req.db.get('users');
	users.find({}).then((result)=>{
		// console.log("Result from MONK", result[0].phone_number)
		console.log("Result from MONK", result)
	})
	
	// mongodb.MongoClient.connect('mongodb://localhost:27017', (err, client)=>{
	// 	        // delete req.body._id; // for safety reasons
	// 	 let  db = client.db('MyDb') 
	// 	 let collection = db.collection('users')
		 
	// 	 collection.insertOne({ id: 1, phone_number: phoneNumber, lat: lat, long: long }, (err, result)=>{
	// 	 	if(err)console.log('error inserting')
	// 	 		console.log("data inserted", result)
	// 	 })   
 //   });
    res.send('Data received:\n' + JSON.stringify(req.body));
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
// 	var collection = db.collection("inventory")
// 	collection.insertOne(
// 	   { item: "canvas", qty: 100, tags: ["cotton"], size: { h: 28, w: 35.5, uom: "cm" } }
// 	)
// 	if(err) throw err;
// 	// db.collection('Persons', function (err, collection) {    
// 	//     collection.insert({ id: 1, phone: 4124214222});

// 	//     db.collection('Persons').count(function (err, count) {
// 	//         if (err) throw err;
	        
// 	//         console.log('Total Rows: ' + count);
// 	//     });

// 	//     console.log(db.collection('Persons').find())
// 	// });
//      //Write databse Insert/Update/Query code here..              
// });

// var url = "mongodb://localhost:27017/movies"

// MongoClient.connect(url, function(err, db) {
// 	if (err) {
// 	    throw err;
// 	}
// 	if (db) {
// 	    console.log("insert");
// 	    var collectionName = 'users'; 
// 	    var collection = db.collection(collectionName);
// 	    if(!collection){
// 	      errCallback('Collection is not defined in database')
// 	    }
// 	    collection.insert({ id: 1, phone: 4124214222, location: "pleasanton"})
// 	    collection.update({
// 	        title: "The Revenant"
// 	    }, {
// 	        '$push': {
// 	            'rating': 5.0
// 	        }
// 	    }, {
// 	        upsert: true
// 	    }, function(err, res) {
// 	        if (err) errCallback(err);
// 	        console.log("it worked!")
// 	        // db.close();
// 	       collection.save();
// 	    });
// 	}
// });











