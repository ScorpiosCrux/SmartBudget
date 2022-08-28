// Library Imports
const express = require("express");
// NOTE: Without mergeParams, we will not be able to get the ID from /:id/ because
// Router likes to keeps params separate
const router = express.Router({ mergeParams: true });

// Functions and Classes
const catchAsync = require("../utils/CatchAsync");
const ExpressError = require("../utils/ExpressError");

// Middleware
const { validateNote } = require("../middleware");

// Controllers
const notes = require("../controllers/notes");

// Routes
router.post("/", validateNote, catchAsync(notes.createNote));

router.delete("/:noteId", catchAsync(notes.deleteNote));

module.exports = router;
