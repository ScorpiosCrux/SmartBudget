// Library Imports
const express = require("express");
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

// Functions and Classes
const catchAsync = require("../utils/CatchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

// Controllers
const transactions = require("../controllers/transactions");

// Routes (order matters)

// prettier-ignore
router.route("/")
    .get(transactions.index)
    // .post(isLoggedIn, validateCampground, catchAsync(transactions.createTransaction));
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files);
        return res.send("It worked!");
    })

router.get("/new", isLoggedIn, transactions.newForm);

// prettier-ignore
router.route("/:id")
    .get(catchAsync(transactions.showTransaction))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(transactions.editTransaction))
    .delete(isLoggedIn, isAuthor, catchAsync(transactions.deleteTransaction));

router.get("/:id/edit", isLoggedIn, isAuthor, transactions.editForm);

module.exports = router;
