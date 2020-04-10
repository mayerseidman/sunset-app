
'use strict';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const fs = require('fs');

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
const PDF2Pic = require("pdf2pic");

function createImage(pdfFile) {
	const baseFile = '/Users/mayerseidman/Desktop/Projects/simple-react-full-stack/';
	let file =  baseFile + pdfFile + ".pdf";
	 
	const pdf2pic = new PDF2Pic({
	  density: 100,           // output pixels per inch
	  savename: pdfFile,   // output file name
	  savedir: path.dirname(file),    // output file location
	  format: "png",          // output file format
	  size: "1000x1000"         // output size in pixels
	});
	 
	pdf2pic.convert(file).then((resolve) => {
	  console.log("image converter successfully!", resolve.name);
	});
	return pdfFile + "_1.png" 
}

var methodOne = function(fileName, quality, time) {
   const promise = new Promise(function(resolve, reject){
      setTimeout(function() {
        console.log('first method completed');
        resolve(createPDF(fileName, quality, time));
      }, 2000);
   });
   return promise;
};

var methodTwo = function(returnedPDF) {
	console.log(returnedPDF)
   const promise = new Promise(function(resolve, reject){
      setTimeout(function() {
        console.log('second method completed', returnedPDF);
        resolve(createImage(returnedPDF));
      }, 2000);
   });
   return promise;
};

// Run the app and set its root // 
const distPath = path.join(__dirname, '../..', 'dist')
app.use(express.static(distPath))

app.get("/", (req, res) => {
	res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(process.env.PORT || 8080, () => console.log("Shemesh APP Running"));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken); 

// SUNSETWX credentials...
const sunsetwx = new SunsetWx({
	email: process.env.EMAIL,
	password: process.env.PASSWORD,
});

// schedule.scheduleJob('26 * * * *', function(){
// 	console.log("RUNNINGG") 
// 	users.find().then((result)=>{
// 		result.forEach(user => {
// 			runIT(user.lat, user.long, (quality) => {
// 				let phoneNumber = user.phone_number;
// 				var momentDate = moment(quality.valid_at).format("H:mm");
// 				methodOne(user._id, quality, momentDate)
//    				.then(methodTwo).then((result)=>{
//    					console.log("image", result)
//    					const message = `Your SUNS°ET Forecast:\n\nTime: ${momentDate}\nQuality: ${quality.quality} (${quality.quality_percent}%)\nTemperature: ${Math.floor(quality.temperature)}°`;
//    					client.messages
// 			  			.create({
// 			  				body: message, 
// 			    			from: process.env.PHONE_NUMBER,
// 			    			to: phoneNumber,
// 			    			mediaUrl: `https://3c3abf0b.ngrok.io/${result}`,
// 			    			contentType: "image/png"
// 						})
// 					.then(message => console.log("IT WORKED: ", message.subresourceUris.media)); 
//    				})	
// 			})
// 		})
// 	}) 
// });

var url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
var job = new CronJob('0 12 * * *', function() { 
	mongodb.MongoClient.connect(url, (err, client)=>{
		const  db = client.db('heroku_9v9cjldm') 
		const users = db.collection('users')
		users.find().toArray().then((result)=>{
			result.forEach(user => {
				var lat = user.lat;
				var long = user.long;
				console.log(lat, long)
				runIT(lat, long).then((sunset) => {
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
		})
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

function runIT(lat, long) {
	return new Promise((resolve, reject) => {
		const coordsString = '' + lat + ',' + long + '';
	    sunsetwx.quality({
	        geo: coordsString,
	        type: 'sunset',
	        limit: '1'
	    }, function (err, httpResponse, body) {
			console.log(body)
			resolve(body.features[0].properties);		
	    });
	});
}

app.post('/api/send', (req, res) => {
	console.log("show me something")
	var lat = req.body.lat;
	var long = req.body.long;
	runIT(lat, long).then((sunset) => {
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

app.post('/api/submit-form', function (req, res) {
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

function createPDF(fileName, quality, time) {
	// PDF KIT 
	console.log(quality, time)
	const PDFDocument = require('pdfkit'); 
	// const blobStream  = require('blob-stream');
	 
	// create a document 
	const doc = new PDFDocument();
	 
	// pipe the document to a blob
	// const stream = doc.pipe(blobStream());  

	// Pipe its output somewhere, like to a file or HTTP response
	// See below for browser usage
	doc.pipe(fs.createWriteStream(fileName + ".pdf")); 
	// doc.pipe(res); 


	// Embed a font, set the font size, and render some text
	

	// Add an image, constrain it to a given size, and center it vertically and horizontally
	doc.image('./testImageNoBorder.png', 0, 17, {width: 612, height: 775}); 
	doc.moveDown(6);
	doc.fontSize(48)
	   .text('SAN DIEGO', {align: "center"});
	doc.fontSize(18)
	doc.moveDown(0.5).text('Sunset: ' + time + ' pm    |    ' + quality.temperature + '° c', {align: "center"})
	doc.moveDown(2.0).fontSize(36).text("Sunset Quality", {align: "center"})
	doc.moveDown(0.5).fontSize(46).font('Times-Bold').text("" + quality.quality + "  ", 220, 340)
	doc.fontSize(18).font("Times-Roman").text('(' + quality.quality_percent + '%)', 330, 360)

	// Fit the image within the dimensions
	// doc.image('/Users/mayerseidman/Desktop/imageFile.png', 320, 15, {fit: [100, 100]})
	//    .rect(320, 15, 100, 100)
	//    .stroke()
	//    .text('Fit', 320, 0);

	// Scale the image
	// doc.image('./testImage.png', 100, 100)
		// .text('Scale', 320, 265)
	 //   .text('Lots', 100, 400);

	doc.end();
	return fileName;
}