const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

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
    res.send('PASSED');
  }
});

module.exports = router;
