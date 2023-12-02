require("dotenv").config();
const bcrypt = require("bcrypt");
const Users = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const UnauthenticatedError = require("../error/unauthenticated");
const CustomError = require("../error/CustomError");
const User = require("../models/User");

const createUser = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  try {
    if (name && email && password && confPassword) {
      const exists = await Users.findOne({ Email: email });
      if (exists) {
        return res
          .status(StatusCodes.CONFLICT)
          .send({ success: false, msg: `Email already exists: ${email}` });
      }
      if (password === confPassword) {
        const hash = await bcrypt.hash(password, 10);
        const user = new Users({ name: name, email: email, password: hash, roles: ["Common"] });
        await user.save();
        req.session.user = user;
        req.session.authorized = true;
        res.status(StatusCodes.CREATED).json({ user });
      } else {
        res.status(StatusCodes.CONFLICT).send({ success: false, msg: "Passwords do not match" });
      }
    } else {
      throw new CustomError("Invalid login data", 404);
    }
  } catch (err) {
    console.log(err);
    return res.status(402).send({ success: false, msg: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ name: username }).catch((err) => console.log("failed"));
    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.password);
    if (!(user && passwordCorrect)) {
      throw new UnauthenticatedError("Invalid username or password");
    }
    req.session.user = user;
    req.session.authorized = true;
    res.status(StatusCodes.OK).send({ success: "true", msg: "logged in" });
  } catch (err) {
    return res.status(402).send({ success: false, msg: err.message });
  }
};

const logout = async (req, res) => {
  try {
    if (!req.session.authorized || !req.session.user) {
      throw new CustomError("Not logged in", 200);
    }
    req.session.destroy();
    res.status(StatusCodes.OK).send({ success: true, msg: "logged out" });
  } catch (err) {
    return res.status(402).send({ success: false, msg: err.message });
  }
};

module.exports = { createUser, login, logout };
