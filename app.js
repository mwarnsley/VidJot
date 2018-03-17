const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

// Connect to mongoose
mongoose
  .connect('mongodb://localhost/vidjot-dev')
  .then(() => console.log('MongoDB Connect...'))
  .catch(error => console.log('Error: ', error));

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('_method'));

// Including the handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Setup the index route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {title});
});

// Setup the about page
app.get('/about', (req, res) => {
  res.render('about');
});

// Setup the add ideas page
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => res.render('ideas/edit', {idea}))
    .catch(error => console.log('Error Editing Idea: ', error));
});

// Idea index page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => res.render('ideas/index', {ideas}))
    .catch(error => console.log('Error Fetching Ideas', error));
});

// Process the add ideas form
app.post('/ideas', (req, res) => {
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
      .then(idea => res.redirect('/ideas'))
      .catch(error => console.log('Error Saving: ', error));
  }
});

app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      idea.title = req.body.title;
      idea.details = req.body.details;

      idea.save().then(idea => res.redirect('/ideas').catch(error => console.log('Error saving idea: ', error)));
    })
    .catch(error => console.log('Error Updating Idea: ', error));
});

app.listen(PORT, () => {
  console.log(`Application running on port: ${PORT}`);
});
