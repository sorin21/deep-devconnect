const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create User Schema and we pass an object with all fields
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  },
});

// users is the name that we want to use
module.exports = User = mongoose.model('users', UserSchema);