// this file defines the two authorization strategies we will be using on this API

const passport = require('passport'), //requires the Passport module
  LocalStrategy = require('passport-local').Strategy, 
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

  let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy( //defines basic HTTP authentication, uses Mongoose to check info in request body against info in database (password doesn't get checked here yet)
    {
      usernameField: 'Username',
      passwordField: 'Password',
    },
    async (username, password, callback) => {
      console.log(`${username} ${password}`);
      await Users.findOne({ Username: username })
      .then((user) => {
        if(!user) {
          console.log('incorrect username');
          return callback(null, false, {
            message: 'Incorrect username or password.',
          });
        }
        console.log('finished');
        return callback(null, user);
      })
      .catch((error) => {
        if (error) {
          console.log(error);
          return callback(error);
        }
      })
    }
  )
);

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), //extracts JWT from the header of the HTTP request
  secretOrKey: 'your_jwt_secret' //do we define this secret key? can it be a string of any characters?
}, async (jwtPayload, callback) => {
  return await Users.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));

