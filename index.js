const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
uuid = require('uuid');

//integrating Mongoose
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

//connects Mongoose to the MongoDB created earlier
mongoose.connect('mongodb://localhost:27017/frDB', { useNewUrlParser: true, useUnifiedTopology: true });
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

//CREATE user, using Mongoose and MongoDB
/* Use the following JSON format:
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/

app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user)=> {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then((user) => {res.status(201).json(user) })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
      }
    })
    .catch((error) =>{
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//UPDATE a user's info, by username
/* Use the following JSON format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
  {
    Username: req.body.Username,
    Password: req.body.Password,
    Email: req.body.Email,
    Birthday: req.body.Birthday
  }
  },
  { new: true }) //makes sure the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })

});

//Add a movie to a user's list of favourites
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavouriteMovies: req.params.MovieID }
  },
  { new: true }) //makes sure the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//DELETE a movie from a user's favourites
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { FavouriteMovies: req.params.MovieID } },
    { new: true })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// DELETE user by username
app.delete('/users/:Username', async (req, res) => {
  await Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err)
    });
});

//READ all movies
app.get('/movies', async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/', (req, res) => {
  res.send('Welcome to For Reel - all the movies you love in one place!');
});

//READ - find a movie by title
app.get('/movies/:Title', async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//READ - search for genre info
app.get('/movies/genre/:genreName', async (req, res) => {
  await Movies.findOne({ "Genre.Name": req.params.genreName })
    .then((genre) => {
      res.status(201).json(genre.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//READ - search for director info
app.get('/movies/directors/:directorName', async (req, res) => {
  await Movies.findOne({ "Director.Name": req.params.directorName })
    .then((director) => {
      res.status(201).json(director.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
})

//GET all users
app.get('/users', async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//GET information for a specific user by username
app.get('/users/:Username', async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
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