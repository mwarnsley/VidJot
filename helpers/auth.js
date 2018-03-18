/**
 * Helper file for functions used throughout the application
 */

module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Not Authorized');
    res.redirect('/users/login');
  }
};
