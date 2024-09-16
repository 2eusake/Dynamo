const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let refreshTokens = []; // Dummy refresh token storage

// Register a new user (open to admins or directors)
const registerUser = async (req, res) => {
  // if (req.user.role !== 'director') {
  //   return res.status(403).json({ message: 'Access denied' });
  // }

  const { username, email, password, role } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword, role });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login a user (open to all users)
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id, role: user.role }, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken, user: { id: user.id, role: user.role, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Refresh access token
const refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token || !refreshTokens.includes(token)) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });

    const newAccessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken: newAccessToken });
  });
};

// Logout a user
const logoutUser = (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(rt => rt !== token);
  res.json({ message: 'Logged out successfully' });
};

// Get all users (restricted to directors)
const getAllUsers = async (req, res) => {
  if (req.user.role !== 'director') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get user profile (open to the logged-in user)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

// Update user profile (open to the logged-in user)
const updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();

    res.json({ message: 'User profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
};
