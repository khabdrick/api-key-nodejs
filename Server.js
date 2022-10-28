const express = require('express');
const app = express();
const port = 4000;

const API = require('./apiAuth');

  

// Get initial data for users and countries
const { users, Countries } = require('./initialData');

//handle json body request
app.use(express.json());


app.get('/', (req, res) => {
  //home page
  res.status(200).send({ data: { message: 'You can get list of countires at /api/country.' } });
});

app.post('/api/register', (req, res) => {
  //create a new with "user:Username"

  let username = req.body.username;
  let user = API.createUser(username, req);

  res.status(201).send({ data: user });
});
app.get('/api/country', API.authenticateKey, (req, res) => {
  //get list of all Countries   
  let today = new Date().toISOString().split('T')[0];
  console.log(today);
  res.status(200).send({
    data: Countries,
  });
});
app.post('/api/country', API.authenticateKey, (req, res) => {
  //add a new country  /:apikey
  let country = {
    _id: Date.now(),
    name: req.body.country,
  };
  Countries.push(country);
  res.status(201).send({
    data: country,
  });
});


app.listen(port, function (err) {
  if (err) {
    console.error('Failure to launch server');
    return;
  }
  console.log(`Listening on port ${port}`);
});
