
const express = require('express');
const os = require('os');
const app = express();

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

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));



// const ocrSpaceApi = require('ocr-space-api');

// var options =  { 
//     apikey: '8f5d685ff588957',
//     language: 'por', // Português
//     imageFormat: 'image/png', // Image Type (Only png ou gif is acceptable at the moment i wrote this)
//     isOverlayRequired: true
// };


// // Image file to upload
// const imageFilePath = "/Users/mayerseidman/Desktop/imageFile.png";

// // Run and wait the result
// ocrSpaceApi.parseImageFromLocalFile(imageFilePath, options)
//   .then(function (parsedResult) {
//     console.log('parsedText: \n', parsedResult.parsedText);
//     console.log('ocrParsedResult: \n', parsedResult.ocrParsedResult);
//   }).catch(function (err) {
//     console.log('ERROR:', err);
//   });