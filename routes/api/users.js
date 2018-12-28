// we need express to use the router
const express = require('express');
const router = express.Router();

// @route  GET api api/users/test
// @desc   Tests users route
// @access Public
router.get('/test', (request, response) => response.json({ msg: 'Users route works' }));

// export the router so serve.js file to pick it up
module.exports = router;