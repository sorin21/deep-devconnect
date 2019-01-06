const Validator = require('validator');
const isEmpty = require('./is-empty');

// data will be an object with user stuff
const validateRegisterInput = (data) => {
  let errors = {};

  // check name, for ex, if is not empty will be what is, but if is empty make it an empty string
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    // add name key to errors object
    errors.name = 'Name must be between 2 and 30 characters';
  }
  // Here we using isEmpty from Validator
  // So above name is made a string if is empty
  // then wil be test it here like an empty string
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }
  // Here we using equals from Validator
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password field is required';
  }

  // return all errors
  return {
    errors,
    // if no errors, errors object will be empty so isVlaid will be true
    isValid: isEmpty(errors)
  }
}

module.exports = validateRegisterInput;