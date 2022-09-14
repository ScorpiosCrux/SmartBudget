// Library Imports
const express = require("express");
const router = express.Router();

// Schemas

// Functions and Classes
const catchAsync = require("../utils/CatchAsync");

// Models
const Transaction = require("../models/transaction");

module.exports.index = async (req, res) => {
    const transactions = await Transaction.find({}); // Using Transactions we look for everything
    res.render("transactions/index", {
        transactions,
    }); // We pass transactions to the EJS template
};

module.exports.newForm = async (req, res) => {
    res.render("transactions/new");
};

module.exports.createTransaction = async (req, res) => {
    const transaction = new Transaction(req.body.transaction);
    transaction.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    transaction.author = req.user._id; // Sets the author for the newly created transaction
    await transaction.save(); // since this is an asyc function, "await" for the promise to resolve
    console.log(transaction)
    req.flash("success", "Successfully created a new transaction!"); // Flashes a message to the user
    res.redirect(`/transactions/${transaction._id}`); // redirect to the transaction we just created
};

module.exports.showTransaction = async (req, res, next) => {
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
};

module.exports.editForm = async (req, res) => {
    // :id is the id of the transaction
    const transaction = await Transaction.findById(req.params.id); // Using the id, we find the transaction in the db
    res.render("transactions/edit", {
        transaction,
    });
};

module.exports.editTransaction = async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndUpdate(id, { ...req.body.transaction }); // We spread the array. Basically making the array/dict args
    req.flash("success", "Successfully updated transaction!");
    res.redirect(`/transactions/${transaction._id}`);
};

module.exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.redirect("/transactions");
};
