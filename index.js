const express = require('express');
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config();
mongoose.set("strictQuery", false);
mongoose.connect(process.env.URIDEV, { useNewUrlParser: true })

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', process.env.URIDEV)
})

db.on('error', err => {
  console.error('connection error:', err)
})


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});