const mongoose = require("mongoose");
const env = require("./environment");

mongoose.connect(
  `mongodb+srv://akhil:${env.db_pass}@cluster0.ic01j.mongodb.net/${env.db}?retryWrites=true&w=majority`,
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
