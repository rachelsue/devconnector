// hold things like location, bio etc
const express = require ("express");
const router = express.Router();

// @route api/profile/test
// @ desc test profile route
// @access Public route
router.get('/test', (req, res)=> res.json({msg: "Profile works"}));

module.exports = router;