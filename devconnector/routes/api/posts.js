//hold posts, comments
const express = require ("express");
const router = express.Router();

// @route api/posts/test
// @ desc test posts route
// @access Public route
router.get('/test', (req, res)=> res.json({msg: "Posts works"}));

module.exports = router;