const User = require("../models/User");
const Task = require("../models/Task")
const { Op } = require('sequelize');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

// Register a new user
// UserController.js (registerUser function)
const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Ensure role is provided and valid
    if (!role || !["Consultant", "Project Manager", "Director"].includes(role)) {
      return res.status(400).json({ message: "Invalid or missing role" });
    }

    // Hash the password and create the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Error registering user", error: error.message });
  }
};


// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    console.log("Generated Access Token:", accessToken);
    console.log("Generated Refresh Token:", refreshToken);

    // Set tokens in secure HTTP-only cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/api/users/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      user: { id: user.id, role: user.role, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(403).json({ message: "Refresh token missing" });

  try {
    const user = await User.findOne({ where: { refreshToken } });
    if (!user)
      return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err) => {
      if (err)
        return res
          .status(403)
          .json({ message: "Invalid or expired refresh token" });

      // Generate new tokens
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        generateTokens(user);

      // Update refresh token in the database
      user.refreshToken = newRefreshToken;
      await user.save();

      // Set new tokens in cookies
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/api/users/refresh",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ message: "Token refreshed successfully" });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error refreshing token", error: error.message });
  }
};

// Logout a user
// UserController.js (logoutUser function)
const logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    if (refreshToken) {
      const user = await User.findOne({ where: { refreshToken } });
      if (user) {
        user.refreshToken = null; // Clear refresh token
        await user.save();
      }
    }

    // Clear cookies on logout
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/api/users/refresh" });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role','groupName'],
      order: [['username', 'ASC']]
    });

    const groupedUsers = {
      consultants: users.filter((user) => user.role === "Consultant"),
      projectManagers: users.filter((user) => user.role === "Project Manager"),
      directors: users.filter((user) => user.role === "Director"),
    };

    res.json(groupedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Get all users (restricted to directors)
// const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.findAll();
//     res.json(users);
//   } catch (error) {``
//     res.status(500).json({ message: 'Error fetching users', error: error.message });
//   }
// };

const filterUsers = async (req, res) => {
  const { role } = req.query;

  try {
    // Build the where clause for User
    const userWhere = {};
    if (role) {
      userWhere.role = role;
    }

    // Execute the query to filter users by role
    const users = await User.findAll({
      where: userWhere,
      attributes: ['id', 'username', 'email', 'role'], // Only include necessary fields
      order: [['username', 'ASC']],
    });

    // Respond with the filtered users
    res.json({
      users,
    });
  } catch (error) {
    console.error('Error filtering users:', error);
    res.status(500).json({ message: 'Error filtering users', error: error.message });
  }
};



const getUsersByRole = async (req, res) => {
  const { role } = req.params;
  try {
    const users = await User.findAll({
      where: { role },
      attributes: ["id", "username"],
      order: [["username", "ASC"]],
    });
    res.json(users);
  } catch (error) {
    console.error(`Error fetching users with role ${role}:`, error);
    res.status(500).json({
      message: `Error fetching users with role ${role}`,
      error: error.message,
    });
  }
};

// Get user profile (open to the logged-in user)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
};

// Update user profile (open to the logged-in user)
const updateUserProfile = async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user profile
    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify Current Password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update Password in Database
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  filterUsers,
  getAllUsers,
  getUsersByRole,
  getUserProfile,
  updateUserProfile,
  resetPassword,
};
