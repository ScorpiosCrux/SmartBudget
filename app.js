// Library Imports
const express = require("express"); //express allows us to start up a server and define routes
const path = require("path"); //allows us to run code from any path
const mongoose = require("mongoose"); //the interface for interacting with mongoDB
const ejsMate = require("ejs-mate"); //allows us to further extend templating
const { join } = require("path");
const Joi = require("joi");
const methodOverride = require("method-override"); //allows other requests other than GET and POST

//Schemas
const { transactionSchema, noteSchema } = require("./schemas.js");

// Functions & Classes
const catchAsync = require("./utils/CatchAsync");
const ExpressError = require("./utils/ExpressError");

// Models
const Transaction = require("./models/transaction"); //I believe this allows us to use the schema and connect to the db?
const Note = require("./models/note");

//Route Requirements
const transactions = require("./routes/transactions");
const notes = require("./routes/notes");

mongoose.connect("mongodb://localhost:27017/smart-budget");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* This parses the request body so that we can use the variables
This is used in app.post('transactions'... */
app.use(express.urlencoded({ extended: true }));

//Since HTML only has get and post, we can still use "put" etc with this
// '_method' will be the query string that is encoded in the URL
app.use(methodOverride("_method"));

/* NOTE:
    When adding a route, order matters a lot here. Each request will take
    the first route possible!
*/

app.use("/transactions", transactions);
app.use("/transactions/:id/notes", notes);

app.get("/", (req, res) => {
  res.render("home");
});

// The app.all method is like global logic
// https://expressjs.com/en/4x/api.html#app.all
// The location of the function is very important as if the routes above don't match
// then it will be caught here
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
  res.send("404!!!");
});

// This could include a bunch of error handling as this is the general route for all errors
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.msg) err.msg = "Something went wrong!";
  res.status(statusCode).render("errors", {
    err,
  });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
