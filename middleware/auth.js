require("dotenv").config();
const UnauthenticatedError = require("../error/unauthenticated");

/* const jwt = require("jsonwebtoken");
const UnauthenticatedError = require("../error/unauthenticated");*/

const authUser = async (req, res, next) => {
  try {
    if (!req.session.authorized) {
      throw new UnauthenticatedError("Unauthorized");
    }
    next();
  } catch (err) {
    return res.status(404).send({ success: "false", message: err.message });
  }
  /* const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer") || authHeader == undefined) {
    res.status(400).send({ success: false, msg: "No token in header" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const { id, username } = decoded;
  req.user = { id, username }; */
};

module.exports = authUser;
