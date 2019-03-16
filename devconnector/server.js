const express = require("express");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const bodyParser = require("body-parser");
const passport = require("passport");

const mongoose = require("mongoose");
// const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3001;

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// passport middleware
app.use(passport.initialize());
// passport config 
require('./config/passport.js')(passport);
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// Add routes, both API and view
app.get("/", (req, res) => res.send("Hello!"));

// Connect to the Mongo DB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/reactreadinglist")
  .then(() => console.log("MongoBD connected"))
  .catch(err => console.log(err));

//Use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});


// branch front-end
// push branch, up to date
//switch to master
//pull
// checkout branch
// git merge master
//pull master into branch
//make changes
//git push to branch again
//THEN do pull request