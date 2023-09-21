const express = require('express'),
morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topMovies = [
  {
    title: 'Lord of the Rings: Return of the King',
    director: 'Peter Jackson'
  },
  {
    title: 'Gladiator',
    director: 'Ridley Scott',
  },
  {
    title: '1917',
    director: 'Sam Mendes',
  },
  {
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
  },
  {
    title: 'Mad Max: Fury Road',
    director: 'George Miller',
  },
  {
    title: 'Tombstone',
    director: 'George P. Cosmatos',
  },
  {
    title: 'The Prestige',
    director: 'Christopher Nolan',
  },
  {
    title: 'Jurassic Park',
    director: 'Steven Spielberg',
  },
  {
    title: 'Indiana Jones and the Last Crusade',
    director: 'Steven Spielberg',
  },
  {
    title: 'Silence of the Lambs',
    director: 'Jonathan Demme',
  }
];



// GET requests
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('Hey, check out these movies!');
});

// this will help fetch documentation.html
app.use(express.static('public'));

//error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('I\'m listening');
});