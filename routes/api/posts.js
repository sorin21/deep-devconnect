// we need express to use the router
const express = require('express');
const router = express.Router();

// @route  GET api api/posts/test
// @desc   Tests posts route
// @access Public
router.get('/test', (request, response) => response.json({ msg: 'Posts route works' }));

// export the router so serve.js file to pick it up
module.exports = router;