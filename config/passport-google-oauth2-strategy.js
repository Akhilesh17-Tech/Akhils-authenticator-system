const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../models/users");
const crypto = require("crypto");
const dotenv = require("dotenv").config();

// tell passport to user a  new strategy for google login

passport.use(
  new googleStrategy(
    {
      clientID:
        "37193647257-tp7truqo6eg15an1ec8b4v0g8g33flct.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/users/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ email: profile.emails[0].value }).exec(function (
        err,
        user
      ) {
        if (err) {
          console.log("Error in google Strategy", err);
          return;
        }
        if (user) {
          // if found set this user as request.user
          return done(null, user);
        } else {
          // if not found create the user and set it as request.user
          User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
            function(err, user) {
              if (err) {
                console.log("Error in creating google strategy :", err);
                return;
              }
              return done(null, user);
            },
          });
        }
      });
    }
  )
);

module.exports = passport;
