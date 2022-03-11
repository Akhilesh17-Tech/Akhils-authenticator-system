//  social authentication using google auth
const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../models/users");
const crypto = require("crypto");
require("dotenv").config();

// tell passport to user a new strategy for google login
passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CLIENT_CALLBACK,
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
