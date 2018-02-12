// Dependencies
// =============================================================
const express = require("express");
const bodyParser = require("body-parser");
const mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
const request = require("request");
const cheerio = require("cheerio");
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];

// Routes
// =============================================================
require("./routes/html-routes.js")(app);
require("./routes/post-api-routes.js")(app);
require("./routes/user-api-routes.js")(app);

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Allows Express app to handle data parsing
// =============================================================

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Allows Express app to serve static files in the public folder
app.use(express.static("public"));

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", function(req, res) {
  res.render("index");
});

//Database Configuration with Mongoose
// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
// Connect to localhost if not a production environment
if (config.use_env_variable === 'development'){
	mongoose.connect('mongodb://localhost/news-scraper_dev', {
		useMongoClient = true;
	});
else
  mongoose.connect('MONGODB_URI', {
  	useMongoClient = true;
  });
}

const db = mongoose.connection;

// Show any Mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// Once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});


// Start our app's listening on either port 3000 or the port that heroku gave us
app.listen(3000, function() {
  console.log("Mongoose news scraper alive and listening on Port "+ PORT);
});

