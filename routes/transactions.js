// Library Imports
const express = require("express");
const router = express.Router();

// Functions and Classes
const catchAsync = require("../utils/CatchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

// Controllers
const transactions = require("../controllers/transactions");

// Routes (order matters)
router
    .route("/")
    .get(transactions.index)
    .post(isLoggedIn, validateCampground, catchAsync(transactions.createTransaction));
    
router.get("/new", isLoggedIn, transactions.newForm);

router
    .route('/:id')
    .get(catchAsync(transactions.showTransaction))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(transactions.editTransaction))
    .delete(isLoggedIn, isAuthor, catchAsync(transactions.deleteTransaction));

router.get("/:id/edit", isLoggedIn, isAuthor, transactions.editForm);

module.exports = router;
