// File for defining the strategies for passport
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
const User = mongoose.model('users');

module.exports = passport => {
  passport.use(
    new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
      // Matching the user
      User.findOne({
        email
      })
        .then(user => {
          if (!user) {
            return done(null, false, {message: 'No User Found'});
          }
          // Match the password if there is a user
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              throw err;
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {message: 'Incorrect Password'});
            }
          });
        })
        .catch(error => console.log('Error finding user: ', error));
    })
  );

  /**
   * Need to serialize and deserialize the user
   * This is done for request and sessions
   */

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
