const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

// initialize const app to express
const app = express();

// DB config
// get mongoURI from keys.js
const db = require('./config/keys').mongoURI;

// Connect to MongoDB using mongoose
mongoose.connect(db, { useNewUrlParser: true })
  // use a promise to check if success
  .then(() => console.log('MongoDB Connected!'))
  .catch((error) => console.log('MongoDB did not connect: ', error.errmsg));

// create a simple route for home page
app.get('/', (request, response) => {
  // send() 
  response.send('Hello React!!!')
});

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// run at port 5000 locally 
// process.env.PORT this is when we run at Heroku
const port = process.env.PORT || 5000;

// pass the port that we want to listen
app.listen(port, () => console.log(`Server running on port ${port}`))