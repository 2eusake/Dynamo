const express = require('express');
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserProfile,
  refreshToken,
  logoutUser,
  updateUserProfile
} = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/', authMiddleware, roleMiddleware(['Project Manager', 'Director']), getAllUsers);
router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);

module.exports = router;
