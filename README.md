# movie api
## App description
This is the server-side component of a "movies" web application. The application will provide users with access to information about different movies, directors, and genres. Users will be able to sign up, update their profile information and create a list of favorite movies. This server-side project is responsible for creating a database to host the movie and user information, as well as an API to communicate with said database.


## Project Criteria:
### Key Features:
  + Return a list of ALL movies to the user
  + Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
  + Return data about a genre (description) by name/title (e.g., “Thriller”)
  + Return data about a director (bio, birth year, death year) by name
  + Allow new users to register
  + Allow users to update their user info (username, password, email, date of birth)
  + Allow users to add a movie to their list of favorites
  + Allow users to remove a movie from their list of favorites
  + Allow existing users to deregister

### User Stories:
 - As a user, I want to be able ot receive information on movies, directors, and genres so that I can learn more about movies I've watched or am interested in.
 - As a user, I want to be able to create a profile so I can save data about my favorite movies. 


## Key dependencies:
- Node.js _JS runtime environment_
- Express _Web application framework for building RESTful APIs_
- MongoDB & Mongoose _NoSQL database & Object Data Modeling Library made for Node.js_ 
- Postman _service for testing & development of API endpoints_
- body-parser _Express middleware for parsing request bodies_
- jsonwebtoken _Library for JWT generation and verification_
- lodash _Utility library for JavaScript_
- passport _Passport strategy for JWT authentication_
- passport-local _Passport strategy for username & password authentication_
- uuid _Library for generating unique identifiers_

## API Endpoints:
### Create a user
- URL: `/users`
- HTTP method: POST
- Request body: A JSON object holding data about new user
  _Example:_
  {Username: testuser01
   Password: testpassword01
   Email: testuser@gmail.com
   Birthday: 01/05/1997
  }
- Response body: a JSON object showing data about new user 
  _Example:_
  {"Username": "testuser01",
   "Password": "testpassword01",
   "Email": "testuser@gmail.com",
   "Birthday": "1997-01-01T05:00:00.000Z",
   "FavouriteMovies": [],
   "_id": "6529b6d6a7fbe586c675000f"
   "__v": 0
  }



