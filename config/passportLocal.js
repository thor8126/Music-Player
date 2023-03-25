const express = require("express");
const app = express();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("../models/User");
const flash = require("express-flash-message");

app.use(passport.initialize());


// router.post('/login', passport.authenticate('local', { 
//   failureRedirect: '/login',
//   successRedirect: '/',
//   failureFlash: true
//  }), (req, res) => {
//   res.redirect('/');
// });

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, done) {
      const user = User.findOne({ email: email }).then((user) => {
        if (!user) {
          return done(null, false);
        }
        bcrypt.compare(password, user.password).then((isMatch) => {
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null,false);
          }
        });
      });
    }
  )
);


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  const user = User.findById(id)
    .then((user) => {
      done(null, user);
    }
    )
    .catch((err) => {
      done(err, null);
    }
    );
});



module.exports = passport;



