const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const SignupModel = require("../Models/Signup");

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields",
      });
    }

    // Check if user already exists
    let user = await SignupModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new SignupModel({
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

module.exports = router;