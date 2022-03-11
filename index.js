const express = require("express");
const port = process.env.PORT || 8000;
const db = require("./config/mongoose");
const dotenv = require("dotenv").config();
const passport = require("passport");
const fetch = require("isomorphic-fetch");
const passportLocal = require("./config/passport-local-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const customMware = require("./config/middleware");
const expressLayouts = require("express-ejs-layouts");
const nodeMailer = require("./config/nodemailer");
const path = require("path");
const queue = require("kue");
const config = require("dotenv").config();
const bodyParser = require("body-parser");
const Recaptcha = require("express-recaptcha").RecaptchaV2;
const env = require("./environment");


//firing the app and setting up views
const app = express();
// To accept HTML form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "authentication",
    // TODO change the secret before deployment
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://akhil:${env.db_pass}@cluster0.ic01j.mongodb.net/${env.db}?retryWrites=true&w=majority`,
      mongooseConnection: db,
      autoRemove: "disabled",
    }),
  })
);

//setting up passport for authentication
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//setting up layouts
app.use(expressLayouts);

//setting up extracted static files
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//middleware for noty
app.use(flash());
app.use(customMware.setFlash);

//middleware for setting up the static files
app.use(express.static("./assets"));

//setting up the routes
app.use("/", require("./routes"));

//starting the app and listening to port
app.listen(port, (err) => {
  if (err) {
    console.log("Error in express server", err);
    return;
  }
  console.log("Express running fine on port : ", port);
});
