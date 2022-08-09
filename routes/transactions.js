// Library Imports
const express = require("express");
const router = express.Router();

// Schemas
const { transactionSchema, noteSchema } = require("../schemas.js");

// Functions and Classes
const catchAsync = require("../utils/CatchAsync");
const ExpressError = require("../utils/ExpressError");

// Models
const Transaction = require("../models/transaction");
const Note = require("../models/note");

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
  validateCampground,
  catchAsync(async (req, res) => {
    const transaction = new Transaction(req.body.transaction);
    await transaction.save(); // since this is an asyc function, "await" for the promise to resolve
    res.redirect(`/transactions/${transaction._id}`); // redirect to the transaction we just created
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    // :id is the id of the transaction
    const transaction = await Transaction.findById(req.params.id).populate(
      "notes"
    ); // Using the id, we find the transaction in the db
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
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndUpdate(id, {
      ...req.body.transaction,
    }); // We spread the array. Basically making the array/dict args
    res.redirect(`/transactions/${transaction._id}`);
  })
);

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Transaction.findByIdAndDelete(id);
  res.redirect("/transactions");
});

router.post(
  "/:id/notes",
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
  "/:id/notes/:noteId",
  catchAsync(async (req, res) => {
    const { id, noteId } = req.params;
    // In the Transaction DB find by ID, pull where notes is equal to noteId
    await Transaction.findByIdAndUpdate(id, { $pull: { notes: noteId } });
    await Note.findByIdAndDelete(noteId);
    res.redirect(`/transactions/${id}`);
  })
);

module.exports = router;