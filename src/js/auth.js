const jwtSecret = 'your_jwt_secret'; //This has to be the same key used in JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport'); //link passport to the file

require('./passport'); //requires the local passports file that contains the Strategies

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, //Username that I'm encoding in the JWT
    expiresIn: '7d', //specifies that the token will expire in 7 days
    algorithm: 'HS256' //the algorith used to "sign" or encode the values of the JWT
  });
}

// POST login endpoint
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if(error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token}) //ES6 shorthand for res.json({ user: user, token: token })
      });
    })(req, res);
  });
}
