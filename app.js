const express = require('express');
const app = express();
const PORT = 4000;

// Including the express middleware
app.use((req, res, next) => {
  console.log(Date.now());
  next();
});

// Setup the index route
app.get('/', (req, res) => {
  res.send('INDEX');
});

app.get('/about', (req, res) => {
  res.send('ABOUT');
});

app.listen(PORT, () => {
  console.log(`Application running on port: ${PORT}`);
});
