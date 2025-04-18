const mongoose = require("mongoose");

const SignupSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Ensuring unique emails
  },
  password: {
    type: String,
    required: true,
  },
});

const SignupModel = mongoose.model("Signup", SignupSchema);
module.exports = SignupModel;

// //const mongoose = require("mongoose");
// import mongoose from "mongoose";

// const SignupSchema = mongoose.Schema({
//     fname: {
//         type: String,
//         required: true,
//     },
//     lname: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     dob: {
//         type: Date,
//         required: true,
//     },
//     roll_no: {
//         type: String,
//         required: true,
//         unique: true,    
//     },
//     college: {
//         type: String,
//         required: true,
//     }
// });

// const SignupModel = mongoose.model("Signup", SignupSchema);
// //module.exports = SignupModel;
// export default SignupModel;