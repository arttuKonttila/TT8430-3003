const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name must be provided"],
  },
  email: {
    type: String,
    required: [true, "Email must be provided"],
  },
  password: {
    type: String,
    required: [true, "Password must be provided"],
  },
  roles: {
    type: [String],
    required: [true, "Roles must be provided"],
  },
});

const Users = mongoose.model("users", userSchema);

module.exports = Users;
