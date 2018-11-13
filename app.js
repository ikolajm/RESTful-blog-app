// Require all installs
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

// Configure mongoose - first time creates this db, after this will always connect to db
mongoose.connect('mongodb://localhost:27017/restfulblog', { useNewUrlParser: true });

// App will look for ejs files by default in "views" folder
app.set("view engine", "ejs");

// Set public directory for css, js files
app.use(express.static("public"));

// Let app use body parser
app.use(bodyParser.urlencoded({extended: true}));

// Let app use method override and look for "_method"
app.use(methodOverride("_method"));

// Create blog schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:
        {
            type: Date,
            default: Date.now
        }
});

// Create blog model
var Blog = mongoose.model("Blog", blogSchema);

// // Filler blog so progress can be seen
// Blog.create({
//     title: "Test Blog",
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaL66FW8ywaYiexRcHP72DxynyxgbkSlQy41q-H96O-TQAJNk-",
//     body: "This is a test blog post to see if something is working"
// })

// ===========
// ROUTES
// ===========

// INDEX
app.get("/", function(req, res) {
    // Redirect to /blogs route
   res.redirect("/blogs");
});

// Show index of all blogs
app.get("/blogs", function(req, res) {
    // Retrieve all blogs from the database using Blog model, data returned as "blogs"
    Blog.find({}, function(err, blogs) {
        if (err) {
            // If error, console.log error
            console.log("An error occurred: " + err);
        } else {
            // Render index.ejs file with data of "blogs" as "blogs"
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW
app.get("/blogs/new", function(req, res) {
    // Send to new.ejs to create new post
    res.render("new");
});

// Create
app.post("/blogs", function(req, res) {
    // Create new blog from form, using the body of the blog object from the form (body-parser)
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            // If error, console.log error
            console.log("An error occurred: " + err);
            // Redirect back to new.ejs
            res.redirect("new");
        } else {
            // Redirect to blog index
            res.redirect("/blogs");
        }
    });
});

// Show
// Get individual blog post and show on own page
app.get("/blogs/:id", function(req, res) {
    // Grab blog post by id in query
    Blog.findById(req.params.id, function(err, singleBlog) {
        if (err) {
            // If error, console.log error
            console.log("An error occurred: " + err);
            // Redirect back to index.ejs
            res.redirect("index");
        } else {
            // Render show template with singleBlog returned as blog
            res.render("show", {blog: singleBlog});
        }
    });
});

// Edit
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            // If error, console.log error
            console.log("An error occurred: " + err);
            // Redirect to single blog page
            res.redirect("/blogs/:id");
        } else {
            // Redirect to edit blog
            res.render("edit", {blog: foundBlog});
        }
    });
});

// Update
app.put("/blogs/:id", function(req, res) {
    // Find blog being updated and add those changes
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if (err) {
            // If error, console.log error
            console.log("An error occurred: " + err);
            // Redirect to single blog page
            res.redirect("/blogs/");
        } else {
            // Redirect to new updated post
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// Delete
app.delete("/blogs/:id", function(req, res) {
    // Destroy
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            // If error, console.log error
            console.log("An error occurred: " + err);
            // Redirect to single blog page
            res.redirect("/blogs/" + req.params.id);
        } else {
             // Redirect to blog index
            res.redirect("/blogs");
        }
    });
    // Redirect to main blog page
});

// ===========

// Have app listen for server (cloud 9 server)
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("App has started successfully...");
})
