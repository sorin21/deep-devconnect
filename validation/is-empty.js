const isEmpty = (value) =>
  // Check for undefinned
  value === undefined ||
  // Check for null 
  value === null ||
  // if is an empty object
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  // if is an empty string
  (typeof value === 'string' && value.trim().length === 0);

module.exports = isEmpty;