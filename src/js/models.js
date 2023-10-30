const mongoose = require('mongoose');

const bcrypt = require('bcrypt'); //imports bcrypt into the file

let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, require: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavouriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie '}]
});

userSchema.statics.hashPassword = (password) => { //function that does the actual password hashing
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = (password) => { //function that compares submitted hashed passwords with the hashed passwords already stored in the db
  return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;

