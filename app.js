const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const PORT = 4000;

// Including the handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Setup the index route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {title});
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.listen(PORT, () => {
  console.log(`Application running on port: ${PORT}`);
});
