// Library Imports
const express = require("express");
// NOTE: Without this, we will not be able to get the ID from /:id/ because
// Router likes to keeps params separate
const router = express.Router({ mergeParams: true });
const passport = require("passport");

// Schemas
// ...

// Functions and Classes
const catchAsync = require("../utils/CatchAsync");
const ExpressError = require("../utils/ExpressError");

// Models
const _ = require("passport-local-mongoose");

// Helper Middleware
// ...

// Controllers
const users = require("../controllers/users");

// Routes
router.get("/register", users.newRegisterForm);

router.post("/register", catchAsync(users.registerNewUser));

router.get("/login", users.newLoginForm);

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.loginUser);

router.get("/logout", users.logoutUser);

// Export
module.exports = router;
