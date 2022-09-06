// If we are in development mode, look for the .env file and replace 
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

// Library Imports
const express = require("express"); //express allows us to start up a server and define routes
const path = require("path"); //allows us to run code from any path
const mongoose = require("mongoose"); //the interface for interacting with mongoDB
const ejsMate = require("ejs-mate"); //allows us to further extend templating
const session = require("express-session"); // allows sessions, check notes for why we use sessions instead of cookies
const flash = require("connect-flash");
const { join } = require("path");
const Joi = require("joi");
const methodOverride = require("method-override"); //allows other requests other than GET and POST
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

//Schemas
const { transactionSchema, noteSchema } = require("./schemas.js");

// Functions & Classes
const catchAsync = require("./utils/CatchAsync");
const ExpressError = require("./utils/ExpressError");

// Models
const Transaction = require("./models/transaction"); //I believe this allows us to use the schema and connect to the db?
const Note = require("./models/note");

//Route Requirements
const transactionRoutes = require("./routes/transactions");
const noteRoutes = require("./routes/notes");
const userRoutes = require("./routes/users");

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

// Since HTML only has get and post, we can still use "put" etc with this
// '_method' will be the query string that is encoded in the URL
app.use(methodOverride("_method"));

// Set it so that the public directory can be seen
app.use(express.static(path.join(__dirname, "public")));

/* NOTE:
    When adding a route, order matters a lot here. Each request will take
    the first route possible!
*/

const sessionConfig = {
    secret: "thisIsMyGreatSecretOnGitHub",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // Should be set to true to prevent XSS. This is the default for express
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Add a week to Date.now(). Date.now is in milliseconds
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));
app.use(flash());

// https://www.passportjs.org/concepts/authentication/
// TODO: You may no longer need to initialize anymore in the new documentation
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware that stores the messaged under res.locals. Make sure this is before routes
// Used in templates
app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.currentUser = req.user; // E.g. Used in navbar to know whether someone is signed in or not
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/fakeUser", async (req, res) => {
    const user = new User({ email: "thisIsATestEmail@gmail.com", username: "test" });
    const newUser = await User.register(user, "notsecure"); // "Registers" a user, hashes, salts, etc
    res.send(newUser);
});

app.use("/transactions", transactionRoutes);
app.use("/transactions/:id/notes", noteRoutes);
app.use("/", userRoutes);

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
