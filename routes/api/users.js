// we need express to use the router
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const gravatar = require('gravatar');
const passport = require('passport');

// to encrypt the password
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secretOrKey } = require('../../config/keys');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginrInput = require('../../validation/login');

// @route  GET api api/users/test
// @desc   Tests users route
// @access Public
router.get('/test', (request, response) => response.json({ msg: 'Users route works' }));

// @route  GET api api/users/register
// @desc   Register users route
// @access Public
router.post('/register', (request, response) => {
  const { isValid, errors } = validateRegisterInput(request.body);
  // console.log('isValid', isValid);
  // Check validation if isValid is not True
  if (!isValid) {
    // return all errors
    return response.status(400).json(errors);
  }

  // Use mongoose method to find if the email exists already
  // request.body.email comes from the form input named email
  // because we setup Body Parser in server.js
  const email = request.body.email;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        errors.email = 'Email already exists'
        return response.status(400).json(errors);
      }
      // else
      // this takes an email an other options: size, rating, default
      // mm will put a no picture image if you  don't have one
      const avatar = gravatar.url(request.body.email, {
        s: '200',
        r: 'PG',
        d: 'mm'
      })
      // creating a resource with mongoose, we put new in front of model name
      // and we pass data as an object
      const newUser = new User({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
        avatar: avatar
      });

      // generate the Salt
      // genSalt() take the characters we want, 10
      // and a callback with an errror, if there is one
      // and gives back that salt
      bcrypt.genSalt(10, (error, salt) => {
        if (error) throw error;
        // create our hash and pass our plain text password, the salt and a callback
        // in callback if there is a error will give it, if not will give us the hash
        // the hash we want to store in database
        bcrypt.hash(newUser.password, salt, (error, hash) => {
          if (error) throw error;
          // set the newUser.password to the hash, because now password is just plain text
          newUser.password = hash;
          // finally save it in database, with save() from mongoose
          newUser.save()
            // will give us the user that is created
            // send back a successful response with that user
            // with response.json(user) we see a object, like response, in postman
            .then(user => response.json(user))
            .catch(error => console.log(error));
        });
      });
    });
});


// @route  GET api api/users/login
// @desc   Login user / Returning JWT token
// @access Public
router.post('/login', (request, response) => {
  const { isValid, errors } = validateLoginrInput(request.body);
  // console.log('isValid', isValid);
  // Check validation if isValid is not True
  if (!isValid) {
    // return all errors
    return response.status(400).json(errors);
  }
  // email and pass from what user tyes
  // when the form si subbmited
  // this is a plain text password from input
  const email = request.body.email;
  const password = request.body.password;

  // Find the user by email using the User model
  User.findOne({ email })
    .then((user) => {
      // console.log(user)
      // Check if the user match, if doesn't the user will be null
      // if there is no user
      if (!user) {
        errors.email = 'User not found in database!'
        // 404 not found
        return response.status(404).json(errors);
      }

      // else
      // if the user is found 
      // use bcrypt to compare
      // Check plain text password from above against 
      // the user.password, hashed, from user from above, that is in database
      // because in else means there is a user 
      // and we have access to it
      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          // isMatch is true or false
          // if is matched is true, user passed
          // console.log(isMatch)
          if (isMatch) {
            // user Matched
            // Create JWT payload
            // payload is what we want to include in token
            // we want to include some user information
            // because when that user is send to server we want to decode it
            // to see what user it is in it
            const payload = { id: user.id, name: user.name, avatar: user.avatar };

            // Send the Token back, after login
            // also we want to include in token secret key and expiration
            // 3600 second is 1h
            // Bearer is a type of protocol
            jwt.sign(payload, secretOrKey, { expiresIn: 3600 }, (error, token) => {
              response.json({
                success: true,
                token: 'Bearer ' + token
              });
            });

            // return response.json({ msg: 'Success' })
          } else {
            errors.password = 'Password incorrect';
            return response.status(400).json(errors);
          }
        });
    });
});

// @route  GET api api/users/current
// @desc   Return current user
// @access Private
// we use jwt strategy
// session false because we are not using session
router.get('/current', passport.authenticate('jwt', { session: false }), (request, response) => {
  // in request.user we have the obj with user stuff
  // res.json(req.user);
  response.json({
    id: request.user.id,
    name: request.user.name,
    email: request.user.email
  });
});


// export the router so serve.js file to pick it up
module.exports = router;