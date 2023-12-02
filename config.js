require("dotenv").config();

let PORT = process.env.PORT;
let MONGODB_URI =
  process.env.NODE_ENV === "test" ? process.env.TEST_CONN_STRING : process.env.CONN_STRING;

module.exports = {
  MONGODB_URI,
  PORT,
};
