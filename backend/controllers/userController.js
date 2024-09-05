// controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword, role });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ error: "An error occurred while registering user" });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, role: user.role, username: user.username }, // Include the username here
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Fetch users error:", error.message);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user profile" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();
    res.json({ message: "User profile updated", user });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user profile" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
};
