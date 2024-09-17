// routes/userRoutes.js
const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  getUserProfile, 
  refreshToken,     
  logoutUser        
} = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserProfile); 
router.get('/', authMiddleware, roleMiddleware, getAllUsers);
router.post('/refresh', refreshToken); 
router.post('/logout', logoutUser);

module.exports = router;
