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
            req.login(registeredUser, err => {
                if (err) return next(err);
                req.flash("success", "Welcome to BudgetSmart!");
                res.redirect("/transactions");
            })
        } catch (e) {
            req.flash("error", e.message);
            res.redirect("register");
        }
    })
);

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "Welcome Back!");
    res.redirect("/transactions");
});

router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Successfully logged out!");
        res.redirect("/transactions");
    });
});

// Export
module.exports = router;
