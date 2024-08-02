// routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser, getAllUsers, getUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserProfile); // Protected route
router.get('/', authMiddleware, getAllUsers); // Protected route

module.exports = router;
