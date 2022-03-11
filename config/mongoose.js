const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

mongoose.connect(
  "mongodb+srv://akhil:akhil1234@cluster0.ic01j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to MongoDB"));

db.once("open", function () {
  console.log("Connected to Database :: MongoDB");
});

module.exports = db;
