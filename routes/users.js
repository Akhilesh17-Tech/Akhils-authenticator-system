const express = require("express");
const router = express.Router();
const passport = require("passport");

const usersController = require("../controllers/usersController");

router.get("/sign-up", usersController.signUP);
router.get("/sign-in", usersController.signIn);
router.get("/profile", usersController.profile);
router.post("/create", usersController.create);
router.get("/sign-out", usersController.destroySession);
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);
router.get("/forgot_password", usersController.forgotPassword);
router.post("/create_reset_token", usersController.createResetPasswordToken);
router.get("/reset_password/:access_token", usersController.resetPassword);
router.post("/update-password/:access_token", usersController.updatePassword);

module.exports = router;
