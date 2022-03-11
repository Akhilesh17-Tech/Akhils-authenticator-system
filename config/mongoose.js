const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(
  `mongodb+srv://akhil:${process.env.DATABASE_PASS}@cluster0.ic01j.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`,
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
