const { Strategy } = require('passport-jwt');
const { ExtractJwt } = require('passport-jwt');
const mongoose = require('mongoose');
const User = mongoose.model('users');

// we need to validate secretOrKey that we sent 
// in the request in users.js
const { secretOrKey } = require('../config/keys');
const opts = {};
// ExtractJwt from fromAuthHeaderAsBearerToken
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretOrKey;

// passport argument comes from  server.js
const passport = (passport) => {
  // to protect the routes
  // jwt_payload includes the user stuff
  // that we included in payload in users.js
  passport.use(new Strategy(opts, (jwt_payload, done) => {
    // console.log(jwt_payload)
    // console.log(done)
    // Get the User that is being send in the token,  to jwt_payload
    User.findById(jwt_payload.id)
      .then((user) => {
        // console.log(user.id)
        // if user exist
        if (user) {
          // return the actual user
          // null is for the error
          return done(null, user);
        }
        // if the user is not found
        // null for error
        // false for user
        return done(null, false);
      })
      .catch(error => {
        console.log(error);
        return done(error);
      });
  }));
}

module.exports = passport;
