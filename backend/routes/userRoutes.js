const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  getUserProfile, 
  refreshToken,     // Import refreshToken controller
  logoutUser        // Import logoutUser controller
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserProfile); // Protected route
router.get('/', authMiddleware, getAllUsers); // Protected route
router.post('/refresh', refreshToken); // Add refresh token route
router.post('/logout', logoutUser);    // Add logout route

module.exports = router;
