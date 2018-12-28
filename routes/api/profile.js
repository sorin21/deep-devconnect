// we need express to use the router
const express = require('express');
const router = express.Router();

// @route  GET api api/profile/test
// @desc   Tests profile route
// @access Public
router.get('/test', (request, response) => response.json({ msg: 'Profile route works' }));

// export the router so serve.js file to pick it up
module.exports = router;