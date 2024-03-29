// Functions and Classes
const catchAsync = require("../utils/CatchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const { storage } = require("../cloudinary");

// Library Imports
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage });

// Controllers
const transactions = require("../controllers/transactions");

// Routes (order matters)

// prettier-ignore
router.route("/")
    .get(transactions.index)
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(transactions.createTransaction));

router.get("/new", isLoggedIn, transactions.newForm);

// prettier-ignore
router.route("/:id")
    .get(catchAsync(transactions.showTransaction))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(transactions.editTransaction))
    .delete(isLoggedIn, isAuthor, catchAsync(transactions.deleteTransaction));

router.get("/:id/edit", isLoggedIn, isAuthor, transactions.editForm);

module.exports = router;
