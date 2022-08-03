const express = require("express"); //express allows us to start up a server and define routes
const path = require("path"); //allows us to run code from any path
const mongoose = require("mongoose"); //the interface for interacting with mongoDB
const ejsMate = require("ejs-mate"); //allows us to further extend templating
const Joi = require("joi");

const { transactionSchema, noteSchema } = require("./schemas.js");
const methodOverride = require("method-override"); //allows other requests other than GET and POST
const Transaction = require("./models/transaction"); //I believe this allows us to use the schema and connect to the db?
const Note = require("./models/note");
const catchAsync = require("./utils/CatchAsync");
const ExpressError = require("./utils/ExpressError");
const { join } = require("path");

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

const validateCampground = (req, res, next) => {
  const { error } = transactionSchema.validate(req.body);

  // If there is an error and it's not empty:
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateNote = (req, res, next) => {
  const { error } = noteSchema.validate(req.body);

  // If there is an error and it's not empty:
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/transactions", async (req, res) => {
  const transactions = await Transaction.find({}); // Using Transactions we look for everything
  res.render("transactions/index", {
    transactions,
  }); // We pass transactions to the EJS template
});

app.get("/transactions/new", async (req, res) => {
  res.render("transactions/new");
});

// validateCampground is added as an argument so that data is passed there before continuing to run here.
app.post(
  "/transactions",
  validateCampground,
  catchAsync(async (req, res) => {
    const transaction = new Transaction(req.body.transaction);
    await transaction.save(); // since this is an asyc function, "await" for the promise to resolve
    res.redirect(`/transactions/${transaction._id}`); // redirect to the transaction we just created
  })
);

app.get(
  "/transactions/:id",
  catchAsync(async (req, res, next) => {
    // :id is the id of the transaction
    const transaction = await Transaction.findById(req.params.id).populate(
      "notes"
    ); // Using the id, we find the transaction in the db
    console.log(transaction);
    res.render("transactions/show", {
      transaction,
    });
  })
);

app.get("/transactions/:id/edit", async (req, res) => {
  // :id is the id of the transaction
  const transaction = await Transaction.findById(req.params.id); // Using the id, we find the transaction in the db
  res.render("transactions/edit", {
    transaction,
  });
});

app.put(
  "/transactions/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndUpdate(id, {
      ...req.body.transaction,
    }); // We spread the array. Basically making the array/dict args
    res.redirect(`/transactions/${transaction._id}`);
  })
);

app.delete("/transactions/:id", async (req, res) => {
  const { id } = req.params;
  await Transaction.findByIdAndDelete(id);
  res.redirect("/transactions");
});

app.post(
  "/transactions/:id/notes",
  validateNote,
  catchAsync(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id); // Find the transaction
    const note = new Note(req.body.note); // Create note
    transaction.notes.push(note);
    await note.save();
    await transaction.save();
    res.redirect(`/transactions/${transaction._id}`);
  })
);

app.delete(
  "/transactions/:id/notes/:noteId",
  catchAsync(async (req, res) => {
    const {id, noteId} = req.params;
    // In the Transaction DB find by ID, pull where notes is equal to noteId
    await Transaction.findByIdAndUpdate(id, {$pull : {notes: noteId}})
    await Note.findByIdAndDelete(noteId);
    res.redirect(`/transactions/${id}`);
  })
);

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
