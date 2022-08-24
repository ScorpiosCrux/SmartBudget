

All routes should be defined as example:
```
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


// Export
module.exports = router;
```