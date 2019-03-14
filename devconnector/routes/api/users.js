//hold authentication username email password etc
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//Load User model
const User = require("../../models/User");

// @route api/users/test
// @ desc test users route
// @access Public route
router.get("/test", (req, res) => res.json({ msg: "Users works" }));

// @route POST api/users/register
// @ desc register a user
// @access Public route

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm" //default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @ desc Login user/ Return JWT token
// @access Public route
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const { errors, isValid } = validateLoginInput(req.body);
  
  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //Find user by email
  User.findOne({ email }).then(user => {
    //Check for user
    if (!user) {
        errors.email = "User not found";
      return res.status(404).json(errors);
    }
    //Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User matched
        //Create JWT payload
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
          errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route GET api/users/current
// @ return current user
// @access Private route

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
