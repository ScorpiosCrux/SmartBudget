// Models
const User = require("../models/user");

module.exports.newRegisterForm = (req, res) => {
    res.render("users/register");
};

// We don't want the user to be displayed a new page with the error, the error should be flashed
// TODO: Don't delete the registered data
module.exports.registerNewUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username, password });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to BudgetSmart!");
            res.redirect("/transactions");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("register");
    }
};

module.exports.newLoginForm = (req, res) => {
    res.render("users/login");
};

// Not actually the logic that logs a user in.
module.exports.loginUser = (req, res) => {
    req.flash("success", "Welcome Back!");
    const redirectUrl = req.session.returnTo || "/transactions"; // This only happens when we set the "returnTo" variable in middleware which needs to be called
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Successfully logged out!");
        res.redirect("/transactions");
    });
};
