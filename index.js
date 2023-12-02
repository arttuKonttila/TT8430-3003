const express = require("express");
const app = express();
const albums = require("./routes/albums");
const users = require("./routes/users");
const connectMongoDB = require("./db/mongodb");
const passport = require("passport");
const session = require("express-session");
const config = require("./config");
require("./db/mongodb");
require("express-async-errors");
app.use(
  session({
    name: "session_id",
    secret: process.env.ACCESS_TOKEN_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
app.use(express.static("./public"));
app.use(express.json());
app.use("/albums", albums);
app.use("/", users);

const port = 5500;

const errorHandlerMiddleware = require("./middleware/error-handler");
app.use(errorHandlerMiddleware);

connectMongoDB(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log({ success: false, msg: err });
  });

module.exports = app;
