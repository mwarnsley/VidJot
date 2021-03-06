const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const {mongoURI} = require('./config/database');

const app = express();
const PORT = process.env.PORT || 4000;

// Load the routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport configuration
require('./config/passport')(passport);

// Connect to mongoose
mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB Connect...'))
  .catch(error => console.log('Error: ', error));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('_method'));

// Middelware for express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware for using connect-flash
app.use(flash());

// Setting Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

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

// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

app.listen(PORT, () => {
  console.log(`Application running on port: ${PORT}`);
});
