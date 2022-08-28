// Library Imports
const express = require("express");
const router = express.Router();

// Schemas
const { transactionSchema } = require("../schemas.js");

// Functions and Classes
const catchAsync = require("../utils/CatchAsync");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn } = require("../middleware");

// Models
const Transaction = require("../models/transaction");

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

router.get("/", async (req, res) => {
    const transactions = await Transaction.find({}); // Using Transactions we look for everything
    res.render("transactions/index", {
        transactions,
    }); // We pass transactions to the EJS template
});

router.get("/new", async (req, res) => {
    res.render("transactions/new");
});

// validateCampground is added as an argument so that data is passed there before continuing to run here.
router.post(
    "/",
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res) => {
        const transaction = new Transaction(req.body.transaction);
        transaction.author = req.user._id; // Sets the author for the newly created transaction
        await transaction.save(); // since this is an asyc function, "await" for the promise to resolve
        req.flash("success", "Successfully created a new transaction!"); // Flashes a message to the user
        res.redirect(`/transactions/${transaction._id}`); // redirect to the transaction we just created
    })
);

router.get(
    "/:id",
    catchAsync(async (req, res, next) => {
        // :id is the id of the transaction
        // Using the id, we find the transaction in the db. Gets the notes, and author
        const transaction = await Transaction.findById(req.params.id).populate("notes").populate("author");
        console.log(transaction);
        if (!transaction) {
            req.flash("error", "Cannot find that campground!");
            return res.redirect("/transactions/");
        }
        res.render("transactions/show", {
            transaction,
        });
    })
);

router.get("/:id/edit", async (req, res) => {
    // :id is the id of the transaction
    const transaction = await Transaction.findById(req.params.id); // Using the id, we find the transaction in the db
    res.render("transactions/edit", {
        transaction,
    });
});

router.put(
    "/:id",
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const transaction = await Transaction.findById(id);
        if (!transaction.author.equals(req.user.id)) {
            req.flash("error", "You do not have permission to do this action!");
            return res.redirect(`/transactions/${id}`);
        }
        const transaction = await Transaction.findByIdAndUpdate(id, { ...req.body.transaction }); // We spread the array. Basically making the array/dict args
        req.flash("success", "Successfully updated transaction!");
        res.redirect(`/transactions/${transaction._id}`);
    })
);

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.redirect("/transactions");
});

module.exports = router;
