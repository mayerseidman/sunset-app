
'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const os = require('os');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json())

const fetch = require("node-fetch")
var MongoClient = require('mongodb').MongoClient;
var SunsetWx = require('node-sunsetwx');


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

app.post('/api/send', (req, res) => {
	var lat = req.body.lat,
	long = req.body.long;
	runIT(lat, long)
});

function myFunc(callback) {
    callback(data); 
}

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

var sunsetwx = new SunsetWx({
		email: 'mzseidman@gmail.com',
		password: 'Victory251',
	});

function runIT(lat, long) {
	var coordsString = '' + long + ',' + lat + '';
	console.log(coordsString)
	sunsetwx.quality({
	        coords: coordsString,
	        type: 'sunset',
	        radius: '1',
	        limit: '1'}, function (err, httpResponse, body) {
	            console.log(body.features[0].properties)
	        });

	// sunsetwx.quality({
	//   coords: '-77.331536,43.271152',
	//   type: 'sunset',
	//   location: 'northamerica',
	//   radius: '24.02',
	//   limit: '42',
	//   timestamp: '2016-07-07T16:26:08Z'
	// }, function(err, httpResponse, body){
	// 	console.log(body)
	// })
}

// runIT();




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













