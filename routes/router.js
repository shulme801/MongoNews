// Dependencies
var express    = require("express");
var bodyParser = require("body-parser");
var logger     = require("morgan");
var mongoose   = require("mongoose");
var router     = express.Router();

// Requiring our Note and Article models--
var Note    = require("../models/note.js");
var Article = require("../models/article.js");

// scraping tools
var request = require("request");
var cheerio = require("cheerio");


// Routes
router.get("/", function (req, res) {
  console.log("In app.get route");
  // Scrape data
  res.redirect('/scrape');
});



router.get("/scrape", function (req, res) {
   var result = [];
  // First, we grab the body of the html with request
  request("https://www.nytimes.com/", function (error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:

    $("article h2").each(function (i, element) {

      var newArticle = {
        id: i,
        title: $(this).children("a").text(),
        link: $(this).children("a").attr("href")
      };
      result.push(newArticle);
    });
    console.log("Scraped");
    res.send(result);
    // res.sendFile('scraped.html', {root: __dirname+ "/public"});    
  });
});

//Save 
router.post("/save", function (req, res) {
  console.log("In save");
  var saveMe = {};
  saveMe.title = req.body.title;
  saveMe.link = req.body.link;
//  saveMe.note = [];
  var entry = new Article(saveMe);

  // Now, save that entry to the db
  entry.save(function (err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    // Or log the doc
    else {
      //  console.log(doc);
    }
  });
  console.log(entry);

});

router.get("/articles", function (req, res) {
  // Grab every doc in the Articles array
  console.log(" I'm looking for articles from server");
  var savedArticles = [];
  Article.find({}, function (error, doc) {
    for (i = 0; i < 10; i++) {
      var oneSavedArt = {
        title: (doc[i].title),
        id: (doc[i]._id),
        link: (doc[i].link),
      //  note: (doc[i].note)
      };
      savedArticles.push(oneSavedArt);
    };
    //console.log(savedArticles);
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.send(savedArticles);
      //res.sendFile('saved.html', {root: __dirname+ "/public"});
    }
  });
});

router.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  console.log(req.params.id);
  Article.findOne({ "_id": req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    // now, execute our query
    .exec(function (error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise, send the doc to the browser as a json object
      else {
        res.json(doc);
      }
    });
});

// Create a new note or replace an existing  note
router.post("/articles/:id", function (req, res) {

  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);
  console.log(newNote);

  // And save the new note the db
  newNote.save(function (error, doc) {

    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {

       console.log(req.params.id);
       console.log(doc._id);
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { $push: 
      { "note": doc._id }
      })
        // Execute the above query
        .exec(function (err, doc) {
                 console.log("here"); 
                 // Log any errors
          if (err) {
            console.log(err);
          }
          else {
            // Or send the document to the browser
            res.send(doc);
          }
        });
    }
  });
});

router.post("/deletenote/:id", function (req, res) {
  console.log("DELETE");
  console.log(req.params.id);
  console.log(req.body.id);
      Note.findById( req.params.id, function(err, doc) {
        if(err){
          console.log(err);
        }
        console.log(doc)
       doc.remove(doc);
        console.log("Deleted");
      })
});

// Export Router to Server.js
module.exports = router;