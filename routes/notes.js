// Library Imports
const express = require("express");
// NOTE: Without this, we will not be able to get the ID from /:id/ because
// Router likes to keeps params separate
const router = express.Router({ mergeParams: true });       

// Schemas


// Functions and Classes
const catchAsync = require("../utils/CatchAsync");
const ExpressError = require("../utils/ExpressError");

// Models
const Transaction = require("../models/transaction");
const Note = require("../models/note");

// Middleware
const { validateNote } = require("../middleware");

// Routes
router.post(
  "/",
  validateNote,
  catchAsync(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id); // Find the transaction
    const note = new Note(req.body.note); // Create note
    transaction.notes.push(note);
    await note.save();
    await transaction.save();
    req.flash('success', 'Created a new note!')
    res.redirect(`/transactions/${transaction._id}`);
  })
);

router.delete(
  "/:noteId",
  catchAsync(async (req, res) => {
    const { id, noteId } = req.params;
    // In the Transaction DB find by ID, pull where notes is equal to noteId
    await Transaction.findByIdAndUpdate(id, { $pull: { notes: noteId } });
    await Note.findByIdAndDelete(noteId);
    req.flash('success', 'Successfully deleted the a note!')
    res.redirect(`/transactions/${id}`);
  })
);

module.exports = router;
