// Library Imports
const express = require("express");
const router = express.Router();

// Functions and Classes
const catchAsync = require("../utils/CatchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

// Controllers
const transactions = require("../controllers/transactions");

// Routes
router.get("/", transactions.index);

router.get("/new", isLoggedIn, transactions.newForm);

router.post("/", isLoggedIn, validateCampground, catchAsync(transactions.createTransaction));

router.get("/:id", catchAsync(transactions.showTransaction));

router.get("/:id/edit", isLoggedIn, isAuthor, transactions.editForm);

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(transactions.editTransaction));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(transactions.deleteTransaction));

module.exports = router;
