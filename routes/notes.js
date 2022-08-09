// Library Imports
const express = require("express");
// NOTE: Without this, we will not be able to get the ID from /:id/ because
// Router likes to keeps params separate
const router = express.Router({ mergeParams: true });       

// Schemas
const { noteSchema } = require("../schemas.js");

// Functions and Classes
const catchAsync = require("../utils/CatchAsync");
const ExpressError = require("../utils/ExpressError");

// Models
const Transaction = require("../models/transaction");
const Note = require("../models/note");

// Helper Middleware
const validateNote = (req, res, next) => {
  const { error } = noteSchema.validate(req.body);

  // If there is an error and it's not empty:
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

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
    res.redirect(`/transactions/${id}`);
  })
);

module.exports = router;
