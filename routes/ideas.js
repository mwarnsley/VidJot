const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea index page
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => res.render('ideas/index', {ideas}))
    .catch(error => console.log('Error Fetching Ideas', error));
});

// Setup the add ideas page
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => res.render('ideas/edit', {idea}))
    .catch(error => console.log('Error Editing Idea: ', error));
});

// Process the add ideas form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({text: 'Please add a title'});
  }
  if (!req.body.details) {
    errors.push({text: 'Please add some details'});
  }
  if (errors.length > 0) {
    res.render('ideas/add', {
      errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Video Idea Added');
        res.redirect('/ideas');
      })
      .catch(error => console.log('Error Saving: ', error));
  }
});

router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      idea.title = req.body.title;
      idea.details = req.body.details;

      idea
        .save()
        .then(idea => {
          req.flash('success_msg', 'Video Idea Updated');
          res.redirect('/ideas');
        })
        .catch(error => console.log('Error saving idea: ', error));
    })
    .catch(error => console.log('Error Updating Idea: ', error));
});

// Delet Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Video Idea Removed');
      res.redirect('/ideas');
    })
    .catch(error => console.log('Error Deleting Idea: ', error));
});

module.exports = router;
