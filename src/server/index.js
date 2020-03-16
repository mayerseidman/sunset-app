
'use strict';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const os = require('os');
var fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const appDb = require('monk')('localhost/MyDb');
const app = express();

// app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

const fetch = require("node-fetch")
const MongoClient = require('mongodb').MongoClient;
const SunsetWx = require('node-sunsetwx');

const { getSunrise, getSunset } = require('sunrise-sunset-js')
const moment = require('moment');
const NodeGeocoder = require('node-geocoder');

const schedule = require('node-schedule');
const mongodb = require('mongodb');
const _ = require('underscore')

// const user = require('firebase-admin');


// user.initializeApp({
// 	credential: user.credential.applicationDefault()
// });

// let db = user.firestore();


// app.use(express.static('dist'));



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


app.post('/api/addUser', function(req, res) {
	db.collection('user').doc().set(req.body)
	.then((result) => {
		res.send({"result": "success"})
	},
	(error) => {
		res.send({"result": "error"})
	})
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


// const pdf = require('pdf-poppler');
// // const path = require('path');

// function createImage(pdfFile) {
// 	const baseFile = '/Users/mayerseidman/Desktop/Projects/simple-react-full-stack/';
// 	let file =  baseFile + pdfFile + ".pdf";
// 	pdf.info(file)
// 		.then(pdfinfo => {
// 	    	console.log(pdfinfo);
// 		});

// 	let opts = {
// 	    format: 'png',
// 	    out_dir: path.dirname(file),
// 	    out_prefix: path.basename(file, path.extname(file)),
// 	    page: null
// 	}
	 
// 	pdf.convert(file, opts)
// 	    .then(res => {
// 	        console.log('Successfully converted', opts);
// 	    })
// 	    .catch(error => {
// 	        console.error(error);
// 	    })
// 	return baseFile + pdfFile
// }



// function produceImage(fileName) {
//   return new Promise(resolve => {
//     setTimeout(() => {
//     	resolve(createImage(fileName))
//     }, 2000);
//   });
// }


var methodOne = function(fileName, quality, time) {
   var promise = new Promise(function(resolve, reject){
      setTimeout(function() {
        console.log('first method completed');
        resolve(createPDF(fileName, quality, time));
      }, 2000);
   });
   return promise;
};

var methodTwo = function(returnedPDF) {
	console.log(returnedPDF)
   var promise = new Promise(function(resolve, reject){
      setTimeout(function() {
        console.log('second method completed', returnedPDF);
        resolve(createImage(returnedPDF));
      }, 2000);
   });
   return promise;
};

// var methodThree = function(returnedImage) {
// 	return new Promise(function(resolve, reject) {
// 		resolve(returnedImage)

// 	})
// }


// methodOne("Output7")
//    .then(methodTwo)
//    .then(methodThree)





// var firstMethod = function() {
//    var promise = new Promise(function(resolve, reject){
//       setTimeout(function() {
//         console.log('first method completed');
//         resolve({data: '123'});
//       }, 2000);
//    });
//    return promise;
// };
 
 
// var secondMethod = function(someStuff) {
//    var promise = new Promise(function(resolve, reject){
//       setTimeout(function() {
//         console.log('second method completed', someStuff);
//         resolve({newData: someStuff.data + ' some more data'});
//       }, 2000);
//    });
//    return promise;
// };
 
// var thirdMethod = function(someStuff) {
//    var promise = new Promise(function(resolve, reject){
//       setTimeout(function() {
//         console.log('third method completed');
//         resolve({result: someStuff.newData});
//       }, 3000);
//    });
//    return promise;
// };
 
// firstMethod()
//    .then(secondMethod)
//    .then(thirdMethod);


// console.log(createdPDF)
// const createdImage = await createImage(createPDF);
// pass image in as mediaURL to Twilio


require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken); 
const users = appDb.get('users');  

// // schedule.scheduleJob('53 * * * *', function(){
// 	console.log("RUNNINGG") 
// 	users.find().then((result)=>{
// 		result.forEach(user => {
// 			runIT(user.lat, user.long, (quality)=>{
// 				let phoneNumber = user.phone_number;
// 				var momentDate = moment(quality.valid_at).format("H:mm");
// 				methodOne(user._id, quality, momentDate)
//    				.then(methodTwo).then((result)=>{
//    					console.log("image", result)
//    					const message = `Your SUNS°ET Forecast:\n\nTime: ${momentDate}\nQuality: ${quality.quality} (${quality.quality_percent}%)\nTemperature: ${Math.floor(quality.temperature)}°`;
//    					client.messages
// 			  			.create({
// 			  				// body: message, 
// 			    			from: '+14123125983',
// 			    			to: phoneNumber,
// 			    			mediaUrl: `https://3c3abf0b.ngrok.io/${result}`,
// 			    			contentType: "image/png"
// 						})
// 					.then(message => console.log("IT WORKED: ", message.subresourceUris.media)); 
//    				})	
// 			})
// 		})
// 	}) 
// // });


// client.messages.create({ 
//     to: "+14124273243", 
//     from: '+14123125983', 
//     body: "Hey Jenny! Good luck on the bar exam!", 
//     mediaUrl: "http://farm2.static.flickr.com/1075/1404618563_3ed9a44a3a.jpg"
//  }, function(err, message) { 
//     console.log(message.sid); 
//  });

function checkForExistingUsers(phoneNumber) {
	const users = appDb.get('users')
	const hasDuplicate = users.find({ phone_number: phoneNumber 
	}).then((result) => {
		return _.isEmpty(result)
	})

	return hasDuplicate

	// users.aggregate(
	// 	{"$group" : { "_id": "$phone_number", "count": { "$sum": 1 } } },
	// 	{"$match": {"_id" :{ "$ne" : null } , "count" : {"$gt": 1} } },
	// 	{"$project": {"phone_number" : "$_id", "_id" : 0} }
	// ).then((result) => {
	// 	console.log(result)
	// 	var existsInSystem = _.filter(result, function(user){ return user.count >= 1; });
	// 	console.log(_.isEmpty(existsInSystem))
	// });
}

const distPath = path.join(__dirname, '../..', 'dist')
app.use(express.static(distPath))

app.get("/", (req, res) => {
	res.sendFile(path.join(distPath, 'index.html'))
})


app.listen(process.env.PORT || 8080, () => console.log(33));

// SUNSETWX work goes here...

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

app.post('/api/sendIntroductoryText', (req, res) => {
	const phoneNumber = req.body.phoneNumber;
	console.log(phoneNumber)
})

app.post('/api/send', (req, res) => {
	console.log("show me soomething")
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
	next(); // always have next() when using middleware 
})

app.post('/api/submit-form', function (req, res) {
	const phoneNumber = "+1" + req.body.user.phone_number;
	const location = req.body.user.location;
	const lat = req.body.user.lat;
	const long = req.body.user.long;

	checkForExistingUsers(phoneNumber).then(function(result) {
		if (!result) {
			console.log("WE GOT A DUPLICATE!!")
			res.send({ error: true });
		} else {
			console.log("Phone number is all 'CLEAR")
		}
	});
	
	// const users = req.db.get('users');
	// users.find({}).then((result)=>{
	// 	// console.log("Result from MONK", result[0].phone_number)
	// 	console.log("Result from MONK", result)
	// })
	
	// mongodb.MongoClient.connect('mongodb://localhost:27017', (err, client)=>{
	// 	        // delete req.body._id; // for safety reasons
	// 	 let  db = client.db('MyDb') 
	// 	 let collection = db.collection('users')
		 
	// 	 collection.insertOne({ id: 1, phone_number: phoneNumber, lat: lat, long: long }, (err, result)=>{
	// 	 	if(err)console.log('error inserting')
	// 	 		console.log("data inserted", result)
	// 	 })   
 //   });


 	// const message = "This is your intro TEXT...Text 'Stop' at any time to stop receving SUNS°ET forecasts."
 	// client.messages
		// .create({
 	// 		body: message, 
 	// 		from: '+14123125983',
 	// 		to: phoneNumber
 	// 	})
 	// .then(message => console.log("IT WORKED: ", message.subresourceUris.media));
    // res.send('Data received:\n' + JSON.stringify(req.body));
});

function runIT(lat, long, callback) {
	const coordsString = '' + lat + ',' + long + '';
	console.log(coordsString)
	sunsetwx.quality({
	    geo: coordsString,
	    type: 'sunset',
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

// stream.on('finish', function() {
//   // get a blob you can do whatever you like with
//   const blob = stream.toBlob('application/pdf');
//   console.log("FINISHED")
 
//   // or get a blob URL for display in the browser
//   const url = stream.toBlobURL('application/pdf');
//   iframe.src = url;
// });






