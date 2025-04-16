const mongoose = require("mongoose");

const SignupSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: false
  },
  password: {
    type: String,
    required: true,
  },
});

const SignupModel = mongoose.model("Signup", SignupSchema);
module.exports = SignupModel;