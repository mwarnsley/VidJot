const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in the new user model
require('../models/User');
const User = mongoose.model('users');

// User login route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Registration route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Post route for register form
router.post('/register', (req, res) => {
  let errors = [];
  if (req.body.password !== req.body.password2) {
    errors.push({text: 'Password do not match!'});
  }
  if (req.body.password.length < 4) {
    errors.push({text: 'Password must be at least 4 characters'});
  }
  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({email: req.body.email})
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email is already in use');
          res.redirect('/users/register');
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) {
                throw err;
              }
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered!');
                  res.redirect('/users/login');
                })
                .catch(error => console.log('Error saving user: ', error));
            });
          });
        }
      })
      .catch(error => console.log('Error Finding User: ', error));
  }
});

module.exports = router;
