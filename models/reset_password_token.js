// access token schema 
const mongoose = require("mongoose");

const resetSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    accessToken: {
      type: String,
    },
    isValid: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const PasswordToken = mongoose.model("PasswordToken", resetSchema);
module.exports = PasswordToken;
