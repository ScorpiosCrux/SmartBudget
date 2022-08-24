// Library Imports
const express = require("express");
// NOTE: Without this, we will not be able to get the ID from /:id/ because
// Router likes to keeps params separate
const router = express.Router({ mergeParams: true });

// Schemas
// ...

// Functions and Classes
// ...

// Models
const User = require("../models/user");

// Helper Middleware
// ...

// Routes
router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", async (req, res) => {
    res.send(req.body);
});

// Export
module.exports = router;
