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
// mongoose.connect('mongodb://localhost:27017/frDB', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
 
app.use(morgan('common'));

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json());

const { check, validationResult } = require('express-validator'); //imports expresss validator library

const cors = require('cors'); //brings CORs into the app
app.use(cors()); //activates the cors variable, allows requests from all origins by default

let auth = require('./auth.js')(app); //imports auth.js into the project. the "app" argument ensures that Express is available in the auth.js file

const passport = require('passport'); //requires the Passport module
require('./passport.js'); //importrs passport.js into this project

//to CREATE user, using Mongoose and MongoDB
/* Use the following JSON format:
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', 
  [//Validation logic using express-validator
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
  async (req, res) => {

  let errors = validationResult(req); //checks the validation object for errors - if an error occurs, the rest of the code will not execute 
  
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password); //takes the password from request body and hashes it before it's stored in the db
  await Users.findOne({ Username: req.body.Username }) //searches the db to see if a user with the requested username already exists
    .then((user)=> {
      if (user) {
        //if such a user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
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

// to UPDATE a user's info, by username
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
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  //Condition to check username in request vs logged-in username
  if(req.user.Username !== req.params.Username){
    return res.status(400).send('Permission denied, you are not authorized to modify other users\' info');
  }
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
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    //Condition to check username in request vs logged-in username
    if(req.user.Username !== req.params.Username){
      return res.status(400).send('Permission denied, you are not authorized to modify other users\' favourite movies');
    }
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
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    //Condition to check username in request vs logged-in username
    if(req.user.Username !== req.params.Username){
      return res.status(400).send('Permission denied, you are not authorized to modify other users\' favourite movies');
    }
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const userToDelete = await Users.findOne({ Username: req.params.Username });

  if (!userToDelete) { //this checks if the user to be deleted exists before checking authorization
    return res.status(400).send(req.params.Username + ' was not found.');
  }
    //Condition to check username in request vs logged-in username
    if(req.user.Username !== req.params.Username){
      return res.status(400).send('Permission denied, you are not authorized to delete other users. ');
    }
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
app.get('/movies', passport.authenticate('jwt', { session: false /* configures Passport.js to use JWT authentication without creating a session */}), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Could not find requested movies. ' + err);
    });
});

app.get('/', (req, res) => {
  res.send('Welcome to For Reel - all the movies you love in one place!');
});

//READ - find a movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Could not find requested movie title. ' + err);
    });
});

//READ - search for genre info
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "Genre.Name": req.params.genreName })
    .then((movie) => {
      res.status(201).json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Could not find requested genre. ' + err);
    });
});

//READ - search for director info
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "Director.Name": req.params.directorName })
    .then((movie) => {
      res.status(201).json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Could not find requested director in database. ' + err);
    });
})

//GET all users
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Could not find all user info. ' + err);
    });
});

//GET information for a specific user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    //Condition to check username in request vs logged-in username
    if(req.user.Username !== req.params.Username){
      return res.status(400).send('Permission denied, you are not authorized to view other users\' information');
    }
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
// app.listen(8080, () => {
//   console.log('I\'m listening');
// });

const port = process.env.PORT || 8080; //looks for a pre-configured port number in the environment variable
app.listen (port, '0.0.0.0',() => {
  console.log('I\m listening on Port ' + port);
});