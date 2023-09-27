const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
uuid = require('uuid');

const app = express();

app.use(morgan('common'));

app.use(bodyParser.json());

let users = [
  {
    "id": 1,
    "name": 'Bob',
    "favoriteMovies": []
  },
  {
    "id": 2,
    "name": 'Karen',
    "favoriteMovies": ['The Shawshank Redemption']
  }
]

let movies = [
  {
    'title': 'Lord of the Rings: Return of the King',
    'director': {
      'name': 'Peter Jackson',
      'bio': 'a bio about Peter Jackson'
    },
    'genre': {
      'name': 'Fantasy',
      'description': 'The author made up some cool stuff like magic and dragons.'
    }
  },
  {
    'title': 'Gladiator',
    'director': {
      'name': 'Ridley Scott',
      'bio': 'a bio about Ridley Scott'
    },
    'genre': {
      'name': 'Drama',
      'description': 'This movie makes people feel things.'
    }
  },
  {
    'title': '1917',
    'director': {
      'name': 'Sam Mendes',
      'bio': 'a bio about Sam Mendes'
    },
    'genre': {
      'name': 'Drama',
      'description': 'This movie makes people feel things.'
    }
  },
  {
    'title': 'The Shawshank Redemption',
    'director': {
      'name': 'Frank Darabont',
      'bio': 'a bio about Frank Darabont'
    },
    'genre': {
      'name': 'Drama',
      'description': 'This movie makes people feel things.'
    }
  },
  {
    'title': 'Mad Max: Fury Road',
    'director': {
      'name': 'George Miller',
      'bio': 'a bio about George Miller'
    },
    'genre': {
      'name': 'Action',
      'description': 'Lots of things happen very quickly.'
    }
  },
  {
    'title': 'Tombstone',
    'director': {
      'name': 'George P. Cosmatos',
      'bio': 'a bio about George P. Cosmatos'
    },
    'genre': {
      'name': 'Drama',
      'description': 'This movie makes people feel things.'
    }
  },
  {
    'title': 'The Prestige',
    'director': {
      'name': 'Christopher Nolan',
      'bio': 'a bio about Christopher Nolan'
    },
    'genre': {
      'name': 'Drama',
      'description': 'This movie makes people feel things.'
    }
  },
  {
    'title': 'Jurassic Park',
    'director': {
      'name': 'Steven Spielberg',
      'bio': 'a bio about Steven Spielberg'
    },
    'genre': {
      'name': 'Action',
      'description': 'Lots of things happen very quickly.'
    }
  },
  {
    'title': 'Indiana Jones and the Last Crusade',
    'director': {
      'name': 'Steven Spielberg',
      'bio': 'a bio about Steven Spielberg'
    },
    'genre': {
      'name': 'Action',
      'description': 'Lots of things happen very quickly.'
    }
  },
  {
    'title': 'Silence of the Lambs',
    'director': {
      'name': 'Jonathan Demme',
      'bio': 'a bio about Jonathan Demme'
    },
    'genre': {
      'name': 'Thriller',
      'description': 'This movie makes people on edge.'
    }
  }
];



//CREATE 
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('users need a name');
  }
});

//UPDATE 
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id );

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user');
  }
});

//POST
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send('no such user');
  }
});

//DELETE requests
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle) ;
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('no such user');
  }
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    users = users.filter( user => user.id != id) ;
    res.status(200).send(` user ${id} has been deleted`);
  } else {
    res.status(400).send('no such user');
  }
});



// READ 
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

app.get('/', (req, res) => {
  res.send('Hey, check out these movies!');
});

app.get('/movies/:title', (req, res) => {
  // const title = req.params.title;
  const { title } = req.params;
  const movie = movies.find( movie => movie.title === title );

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie')
  }
})

app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.genre.name === genreName ).genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre')
  }
})

app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.director.name === directorName ).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director')
  }
})

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