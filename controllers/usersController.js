const User = require("../models/users");
const path = require("path");
const bcrypt = require("bcrypt");
const PasswordToken = require("../models/reset_password_token");
const resetLinkMailer = require("../mailers/forgot_password_mailer");
const queue = require("../config/kue");
const emailWorker = require("../workers/email_worker");
const crypto = require("crypto");
const { render } = require("ejs");
const dotenv = require("dotenv").config();
const fetch = require("isomorphic-fetch");

//rendering the sign up form
module.exports.signUP = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("signUp", {
    title: "Authenticator | Sign Up",
  });
};

//rendering the sign in form
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("signIn", {
    title: "Authenticator | Sign In",
  });
};

//profile page of user
module.exports.profile = function (req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect("/users/sign-in");
  }
  User.findById(req.params.id, function (err, users) {
    return res.render("user_profile", {
      title: "Authenticator | Profile",
      profile_user: users,
    });
  });
};

// creating the user in database
module.exports.create = async function (req, res) {
  try {
    if (req.body.password != req.body.confirm_password) {
      req.flash("error", "Password doesn't match");
      return res.redirect("back");
    }
    // find user email if alreay exist
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      let salt = 7;
      // encrypting password
      let passwordHash = await bcrypt.hash(req.body.password, salt);
      // creating user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: passwordHash,
      });
      req.flash("success", "You have signed up, login to continue!");
      return res.redirect("/users/sign-in");
    } else {
      req.flash("error", "Email already used! login to continue");
      return res.redirect("/users/sign-in");
    }
  } catch (err) {
    console.log("Error", err);
    return;
  }
};

// sign in and create a session for the user
module.exports.createSession = async function (req, res) {
  const response_key = req.body["g-recaptcha-response"];
  const secret_key = process.env.SECRETKEY;
  console.log(response_key);
  console.log(secret_key);

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;
  const existingUser = await User.findOne({ email: req.body.email });

  fetch(url, {
    method: "post",
  })
    .then((response) => response.json())
    .then((google_response) => {
      console.log("**************", google_response);
    });

  req.flash("success", "Logged in Successfully");
  return res.redirect("/users/profile");
};

// when user forgot their password
module.exports.forgotPassword = function (req, res) {
  return res.render("forgot_password", {
    title: "Authenticator | Forgot Password",
  });
};

// access token for reseting password via reset link
module.exports.createResetPasswordToken = async function (req, res) {
  try {
    let reqUser = await User.findOne({ email: req.body.email });

    if (reqUser) {
      let passwordToken = await PasswordToken.create({
        user: reqUser._id,
        accessToken: crypto.randomBytes(20).toString("hex"),
        isValid: true,
      });

      passwordToken = await passwordToken.populate("user", "email");
      // resetLinkMailer.newResetLink(passwordToken);
      let job = queue.create("emails", passwordToken).save(function (err) {
        if (err) {
          console.log("Error in sending job", err);
          return;
        }
        req.flash("success", "Reset Link sent! to your registered mail");
        return res.redirect("back");
      });
    }
    if (!reqUser) {
      req.flash("error", "Email does not exist!");
      return res.redirect("/users/sign-in");
    }
  } catch (err) {
    console.log("Error in creating reset token", err);
  }
};

// sign out the user
module.exports.destroySession = function (req, res) {
  req.logout();
  req.flash("success", "You have logged out!");

  return res.redirect("/");
};

// usign access token for reseting the password
module.exports.resetPassword = async function (req, res) {
  try {
    let passwordToken = await PasswordToken.findOne({
      accessToken: req.params.access_token,
    });
    let id = passwordToken.user.toString();
    let user = await User.findById(id);
    return res.render("user_reset_password", {
      title: "Authenticator | Reset Password",
      password_token: passwordToken,
      user: user,
    });
  } catch (err) {
    console.log("Error in accessing reset token!", err);
    return;
  }
};

//updating the details of the user
module.exports.updatePassword = async function (req, res) {
  let passwordToken = await PasswordToken.findOneAndUpdate(
    { accessToken: req.params.access_token },
    { isValid: false }
  );
  if (passwordToken.isValid == true) {
    if (req.body.password != req.body.confirm_password) {
      req.flash("error", "Passwords don't match!");
      return res.redirect("back");
    }
    let salt = 7;
    // encrypting password
    let passwordHash = await bcrypt.hash(req.body.password, salt);
    console.log(passwordHash);
    User.findByIdAndUpdate(
      passwordToken.user,
      { password: passwordHash },
      function (err, user) {
        if (err) {
          console.log("Error while resetting the password", err);
          return;
        }
        if (user) {
          req.flash("success", "Password updated successfully!");
          return res.redirect("/users/sign-in");
        }
      }
    );
  }
};
