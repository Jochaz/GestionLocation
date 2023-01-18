const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');

dotenv.config();

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
  });


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});