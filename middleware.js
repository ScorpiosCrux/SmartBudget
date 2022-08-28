const { transactionSchema, noteSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Transaction = require("./models/transaction");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in to see this page.");
        return res.redirect("/login");
    }
    next();
};

module.exports.validateCampground = (req, res, next) => {
    const { error } = transactionSchema.validate(req.body);
    // If there is an error and it's not empty:
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (!transaction.author.equals(req.user.id)) {
        req.flash("error", "You do not have permission to do this action!");
        return res.redirect(`/transactions/${id}`);
    }
    next();
};

// Helper Middleware
module.exports.validateNote = (req, res, next) => {
    const { error } = noteSchema.validate(req.body);
  
    // If there is an error and it's not empty:
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };