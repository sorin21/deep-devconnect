// we need express to use the router
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// used for protected routes
const passport = require('passport');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

// Load Validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// @route  GET api api/profile/test
// @desc   Tests profile route
// @access Public
router.get('/test', (request, response) => response.json({ msg: 'Profile route works' }));

// @route  GET  api/profile
// @desc   Get current users profile
// @access Private route
router.get('/', passport.authenticate('jwt', { session: false }), (request, response) => {
  const errors = {};

  // we want to fetch the current user's profile
  // because is a protected route we will get a token
  // that token is gonna put the user into request.user
  // request.user will have all the user info
  const user = request.user.id;

  // Find the user by ID
  Profile.findOne({ user })
    // because we connected the user collection to profile inside the model
    // we are able to populate fields from user in this response
    // we want to populate from user, two fields, so we put an array []
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return response.status(404).json(errors)
      }
      // else, if there is a profile
      response.json(profile);
    })
    .catch(erorr => response.status(404).json(erorr));
});


// @route  POST  api/profile
// @desc   Create user profile
// @access Private route
router.post('/', passport.authenticate('jwt', { session: false }), (request, response) => {
  const { errors, isValid } = validateProfileInput(request.body);

  // Check Validation
  if (!isValid) {
    // Return any errros with 400 status
    return response.status(400).json(errors);
  }

  // we want to fetch the current user's profile
  // because is a protected route we will get a token
  // that token is gonna put the user into request.user
  // request.user will have all the user info
  const user = request.user.id;

  // get fields
  // we put everything in an object profileFields
  const profileFields = {};
  // user doesn't come from form so we get it from request
  // request.user.id comes from legged user
  // and will include the avatar, name and email
  profileFields.user = user;
  // Check if the handle is send by the form
  if (request.body.handle) profileFields.handle = request.body.handle;
  if (request.body.company) profileFields.company = request.body.company;
  if (request.body.website) profileFields.website = request.body.website;
  if (request.body.location) profileFields.location = request.body.location;
  if (request.body.status) profileFields.status = request.body.status;
  if (request.body.bio) profileFields.bio = request.body.bio;
  if (request.body.github) profileFields.github = request.body.github;

  // Skills - split into array
  // skills will come in as comma separated
  if (typeof request.body.skills !== 'undefined') {
    // make an array of skills to pun into database
    profileFields.skills = request.body.skills.split(',');
  };

  // Social
  profileFields.social = {};
  if (request.body.youtube) profileFields.social.youtube = request.body.youtube;
  if (request.body.twitter) profileFields.social.twitter = request.body.twitter;
  if (request.body.facebook) profileFields.social.facebook = request.body.facebook;
  if (request.body.linkedin) profileFields.social.linkedin = request.body.linkedin;
  if (request.body.instagram) profileFields.social.instagram = request.body.instagram;

  // Find the user by ID
  Profile.findOne({ user: request.user.id })
    .then(profile => {
      if (profile) {
        // Update Profile
        // we put argumet: who do we want to update: user
        // set the profileFields that is an object that we created from the input
        // new: bool - if true, return the modified document rather than the original
        Profile.findOneAndUpdate({ user: request.user.id }, { $set: profileFields }, { new: true })
          .then(profile => response.json(profile))
      } else {
        // Create Profile
        // Check if handle exist, because we don't want multiple handles
        // all the input is in profileFields
        Profile.findOne({ handle: profileFields.handle })
          .then(profile => {

            if (profile) {
              errors.handle = 'That handle already exists';
              response.status(400).json(errors);
            }
            // Save Profile
            new Profile(profileFields)
              .save()
              .then(profile => response.json(profile));
          })
      }
    })
});

// @route  GET api/profile/handle/:handle
// @desc   Get profile by handle
// @access Public route
router.get('/handle/:handle', (request, response) => {
  const errors = {};
  // this :handle in url will be request.params.handle
  const handle = request.params.handle;
  Profile.findOne({ handle })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return response.status(404).json(errors)
      }
      response.json(profile);
    })
    .catch(error => response.status(404).json(error));
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user ID
// @access Public route
router.get('/user/:user_id', (request, response) => {
  const errors = {};
  const user = request.params.user_id
  // find by the user
  // get the user from URL
  Profile.findOne({ user })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return response.status(404).json(errors)
      }
      response.json(profile);
    })
    .catch(error => {
      errors.profile = 'There is no profile for this user';
      return response.status(404).json(errors);
    });
});


// @route  GET api/profile/all
// @desc   Get all profiles
// @access Public route
router.get('/all', (request, response) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return response.status(404).json(errors)
      }
      response.json(profiles);
    })
    .catch(error => {
      errors.profile = 'There are no profiles';
      response.status(404).json(errors);
    });

});


// @route  POST api/profile/experience
// @desc   Add experience to profile
// @access Private route
router.post('/experience', passport.authenticate('jwt', { session: false }), (request, response) => {
  const { errors, isValid } = validateExperienceInput(request.body);

  // Check Validation
  if (!isValid) {
    // Return any errros with 400 status
    return response.status(400).json(errors);
  }

  // find by the logged in user
  // request.user.id comes from the token
  Profile.findOne({ user: request.user.id })
    .then((profile) => {
      const newExp = {
        // all come from the form inputs
        title: request.body.title,
        company: request.body.company,
        location: request.body.location,
        from: request.body.from,
        to: request.body.to,
        current: request.body.current,
        description: request.body.description
      }

      // Add to profile array the experience, at the begginig
      profile.experience.unshift(newExp);

      profile
        .save()
        .then((profile) => response.json(profile));
    })
});


// @route  POST api/profile/education
// @desc   Add education to profile
// @access Private route
router.post('/education', passport.authenticate('jwt', { session: false }), (request, response) => {
  const { errors, isValid } = validateEducationInput(req.body);

  // Check Validation
  if (!isValid) {
    // Return any errros with 400 status
    return response.status(400).json(errors);
  }

  // find by the logged in user
  // req.user.id comes from the token
  Profile.findOne({ user: request.user.id })
    .then((profile) => {
      const newEdu = {
        school: request.body.school,
        degree: request.body.degree,
        fieldofstudy: request.body.fieldofstudy,
        from: request.body.from,
        to: request.body.to,
        current: request.body.current,
        description: request.body.description
      }

      // Add to profile array the experience
      profile.education.unshift(newEdu);

      profile
        .save()
        .then((profile) => response.json(profile));
    })
});


// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete experience from profile
// @access Private route
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (request, response) => {

  // find by the logged in user
  // request.user.id comes from the token
  Profile.findOne({ user: request.user.id })
    .then((profile) => {
      // Get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(request.params.exp_id);

      // Splice out of array
      profile.experience.splice(removeIndex, 1);

      // Save it
      profile.save().then(profile => response.json(profile));
    })
    .catch(error => response.status(404).json(error));
});


// @route  DELETE api/profile/education/:edu_id
// @desc   Delete education from profile
// @access Private route
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (request, response) => {

  // find by the logged in user
  // request.user.id comes from the token
  Profile.findOne({ user: request.user.id })
    .then((profile) => {
      // Get remove index
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(request.params.edu_id);

      // Splice out of array
      profile.education.splice(removeIndex, 1);

      // Save it
      profile.save().then(profile => response.json(profile));
    })
    .catch(error => response.status(404).json(error));
});

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

// export the router so serve.js file to pick it up
module.exports = router;