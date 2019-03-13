//hold authentication username email password etc
const express = require ("express");
const router = express.Router();

// @route api/users/test
// @ desc test users route
// @access Public route
router.get('/test', (req, res)=> res.json({msg: "Users works"}));

module.exports = router;