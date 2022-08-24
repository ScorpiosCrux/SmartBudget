// Library Imports
const express = require("express");
// NOTE: Without this, we will not be able to get the ID from /:id/ because
// Router likes to keeps params separate
const router = express.Router({ mergeParams: true });

// Schemas
// ...

// Functions and Classes
const catchAsync = require("../utils/CatchAsync");
const ExpressError = require("../utils/ExpressError");

// Models
const User = require("../models/user");
const _ = require("passport-local-mongoose");

// Helper Middleware
// ...

// Routes
router.get("/register", (req, res) => {
    res.render("users/register");
});

// We don't want the user to be displayed a new page with the error, the error should be flashed
// TODO: Don't delete the registered data
router.post(
    "/register",
    catchAsync(async (req, res) => {
        try {
            const { email, username, password } = req.body;
            const user = new User({ email, username, password });
            const registeredUser = await User.register(user, password);
            req.flash("success", "Welcome to BudgetSmart!");
            res.redirect("/transactions");
        } catch (e) {
            req.flash("error", e.message);
            res.redirect("register");
        }
    })
);

// Export
module.exports = router;
