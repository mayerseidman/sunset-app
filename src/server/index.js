
'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const os = require('os');
var fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const appDb = require('monk')('localhost/MyDb');
const app = express();

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

const fetch = require("node-fetch")
const MongoClient = require('mongodb').MongoClient;
const SunsetWx = require('node-sunsetwx');

const { getSunrise, getSunset } = require('sunrise-sunset-js')
const moment = require('moment');
const NodeGeocoder = require('node-geocoder');

const schedule = require('node-schedule');
const mongodb = require('mongodb');

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

// const PDF2Pic = require("pdf2pic");

// const pdf2pic = new PDF2Pic({
//   density: 100,           // output pixels per inch
//   savename: "untitledDDD",   // output file name
//   savedir: "/Projects",    // output file location
//   format: "png",          // output file format
//   size: "600x600"         // output size in pixels
// });

// pdf2pic.convert("outputTwo.pdf").then((resolve) => {
//   console.log("image converter successfully!");
 
//   return resolve;
// });

// var PDFImage = require("pdf-image").PDFImage;
 
// var pdfImage = new PDFImage("/outputTwo.pdf");
// console.log(pdfImage)
// pdfImage.convertPage(0).then(function (imagePath) {
// 	console.log("running")
//   // 0-th page (first page) of the slide.pdf is available as slide-0.png
//   fs.existsSync("untitledddd.png") // => true
// });

const pdf = require('pdf-poppler');
const path = require('path');
 
let file = '/Users/mayerseidman/Desktop/Projects/simple-react-full-stack/outputTwo.pdf'
 
pdf.info(file)
	.then(pdfinfo => {
    	console.log(pdfinfo);
	});

let opts = {
    format: 'png',
    out_dir: path.dirname(file),
    out_prefix: path.basename(file, path.extname(file)),
    page: null
}
 
pdf.convert(file, opts)
    .then(res => {
        console.log('Successfully converted');
    })
    .catch(error => {
        console.error(error);
    })  

    
 
// Your Account Sid and Auth Token from twilio.com/console 
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'ACa7a50c421d7be9a3e7ab894026d00460';
const authToken = '44bae3f2f320dd1e74efb1dd5f0bf78f';
const client = require('twilio')(accountSid, authToken);

// schedule.scheduleJob('13 * * * *', function(){
// 	const users = appDb.get('users')
// 	users.find().then((result)=>{
// 		result.forEach(user => {
// 			// runIT(user.lat, user.long, (quality)=>{
// 				let phoneNumber = user.phone_number;
// 				client.messages
// 			  	.create({
// 			    	from: '+14123125983',
// 			    	to: phoneNumber,
// 			    	mediaUrl: "https://06b531d5.ngrok.io/outputTwo.pdf"
// 				})
// 				.then(message => console.log("IT WORKED: ", message));	
// 			// })
// 		})
		
// 	})
// });


app.listen(process.env.PORT || 8080, () => console.log(33));




const sunsetwx = new SunsetWx({
	email: 'mzseidman@gmail.com',
	password: 'Victory251',
});

function convertUTCDateToLocalDate(date) {
    const newDate = new Date(date);
    newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return newDate;
}

// San Diego = 32.7157, -117.1611

app.post('/api/send', (req, res) => {
	const lat = req.body.lat,
	long = req.body.long;
	 runIT(lat, long, (quality)=>{
	 	console.log(quality)
		res.send({ quality })
		// const accountSid = 'ACa7a50c421d7be9a3e7ab894026d00460';
		// const authToken = '44bae3f2f320dd1e74efb1dd5f0bf78f';
		// const client = require('twilio')(accountSid, authToken);
		// const message = "QUALITY: " + quality.quality + "\n" + " Quality Percent: " + quality.quality_percent;

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

	// const j = schedule.scheduleJob('15 * * * *', function(){
	//   console.log('People Can Feel PERFECTION BITCH');
	// });

	// schedule.scheduleJob('25 * * * *', function(){
	// 	console.log('People Can Feel PERFECTION BITCH');
	// })

	// schedule.scheduleJob({ hour: 12, minute: 00 }, function(){
	//   console.log('Time for tea Binch!');
	// });
});

// const dbConn = mongodb.MongoClient.connect('mongodb://localhost:27017', (err, client)=>{

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
	const phoneNumber = "+1" + req.body.user.phone_number;
	const location = req.body.user.location;
	const lat = req.body.user.lat;
	const long = req.body.user.long;
	
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
	const coordsString = '' + long + ',' + lat + '';
	sunsetwx.quality({
	    coords: coordsString,
	    type: 'sunset',
	    radius: '1',
	    limit: '1'
	}, function (err, httpResponse, body) {
		if (callback) {
			console.log(body)
			callback(body.features[0].properties);		
		}
	});

	const sunsetTime = getSunset(lat, long);
	const date = convertUTCDateToLocalDate(new Date(sunsetTime));
	// const date = new Date(sunsetTime + 'UTC');
	// console.log(date.toString())

}


// Connect to the db
// MongoClient.connect("mongodb://localhost:27017/MyDb", function (err, db) {
// 	const collection = db.collection("inventory")
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

// const url = "mongodb://localhost:27017/movies"

// MongoClient.connect(url, function(err, db) {
// 	if (err) {
// 	    throw err;
// 	}
// 	if (db) {
// 	    console.log("insert");
// 	    const collectionName = 'users'; 
// 	    const collection = db.collection(collectionName);
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


// PDF KIT 


const PDFDocument = require('pdfkit');
// const blobStream  = require('blob-stream');
 
// create a document the same way as above
const doc = new PDFDocument();
 
// pipe the document to a blob
// const stream = doc.pipe(blobStream());  

// Pipe its output somewhere, like to a file or HTTP response
// See below for browser usage
doc.pipe(fs.createWriteStream('outputTwo.pdf'));
// doc.pipe(res); 


// Embed a font, set the font size, and render some text
doc.fontSize(25)
   .text('Some text with an embedded font!', 100, 100);

// Add an image, constrain it to a given size, and center it vertically and horizontally
doc.image('/Users/mayerseidman/Desktop/imageFile.png', {
   fit: [250, 300],
   align: 'center',
   valign: 'center'
});

// Add another page
// doc.addPage()
//    .fontSize(25)
//    .text('Here is some vector graphics...', 100, 100);

// Draw a triangle
// doc.save()
//    .moveTo(100, 150)
//    .lineTo(100, 250)
//    .lineTo(200, 250)
//    .fill("#FF3300");

// Apply some transforms and render an SVG path with the 'even-odd' fill rule
// doc.scale(0.6)
//    .translate(470, -380)
//    .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
//    .fill('red', 'even-odd')
//    .restore();

// Add some text with annotations
// doc.addPage()
//    .fillColor("blue")
//    .text('Here is a link!', 100, 100)
//    .underline(100, 100, 160, 27, {color: "#0000FF"})
//    .link(100, 100, 160, 27, 'http://google.com/')
 
// add your content to the document here, as usual
 
// get a blob when you're done
doc.end()
// stream.on('finish', function() {
//   // get a blob you can do whatever you like with
//   const blob = stream.toBlob('application/pdf');
//   console.log("FINISHED")
 
//   // or get a blob URL for display in the browser
//   const url = stream.toBlobURL('application/pdf');
//   iframe.src = url;
// });






