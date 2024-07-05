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
- Request body: A JSON object holding data about new user (see documentation.html for examples)
- Response body: a JSON object showing data about new user (see documentation.html for examples)

### Update user info
- URL: `/users/:Username`
- HTTP method: PUT
- Request body: A JSON object holding updated user info (see documentation.html for examples)
- Response body: a JSON object holding data about updated user (see documentation.html for examples)

### Update user info
- URL: `/users/:Username`
- HTTP method: PUT
- Request body: A JSON object holding updated user info (see documentation.html for examples)
- Response body: a JSON object holding data about updated user (see documentation.html for examples)

### Add movie to user's favorites
- URL: `/users/:username/movies/:movieID`
- HTTP method: POST
- Request body: Username (logged in user) & MovieID, a unique _id number assigned to each movie in database
- Response body: a JSON object holding data about updated user (see documentation.html for examples)

### Remove a  movie from user's favorites
- URL: `/users/:username/movies/:movieID`
- HTTP method: DELETE
- Request body:  Username (logged in user) MovieID, a unique _id number assigned to each movie in database
- Response body: a JSON object holding data about updated user (see documentation.html for examples)

### Delete a user by username
- URL: `/users/:Username`
- HTTP method: DELETE
- Request body: Username (currently logged in user)
- Response body: a message informing user the profile has been deleted

### Get al users
- URL: `/users/`
- HTTP method: GET
- Request body: None
- Response body: a JSON object holding data about all users

### Get a single user
- URL: `/users/:Username`
- HTTP method: GET
- Request body: None
- Response body: a JSON object holding data about searched user

### Get all movies
- URL: `/movies/`
- HTTP method: GET
- Request body: None
- Response body: a JSON object holding data about all movies present in database (see documentation.html for examples)

### Get one movie by title
- URL: `/movies/:Title`
- HTTP method: GET
- Request body: None
- Response body: a JSON object holding data about searched movie containing title, description, imagepath, id, director, genre, featured actors and its "featured" status (see documentation.html for examples)

### Get genre info
- URL: `/movies/:genre/:genreName`
- HTTP method: GET
- Request body: None
- Response body: a JSON object holding data about searched genre (see documentation.html for examples)

### Get director info
- URL: `/movies/:directors/:directorName`
- HTTP method: GET
- Request body: None
- Response body: a JSON object holding data about director (see documentation.html for examples)



