const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
require('dotenv').config();



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  (accessToken, refreshToken, profile, done) => {
    // Use profile information to check if user already exists
    User.findOne({ googleId: profile.id }).then((user) => {
      if (user) {
        // User already exists
        done(null, user);
      } else {
        // Create new user
        new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value,
        }).save().then((newUser) => {
          done(null, newUser);
        });
      }
    });
  }));

module.exports = passport;