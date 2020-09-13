const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_CLUSTER_URI;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true });
console.log('Here?')
client.connect(async err => {
	console.log('Inside')
  const collection = client.db("heroku_9v9cjldm").collection("users");
  //console.log(collection)
  // perform actions on the collection object
  const user = await collection.count();
  console.log(user)
  client.close();
});
