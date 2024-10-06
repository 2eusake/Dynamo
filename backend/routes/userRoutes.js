const express = require("express");
const { resetPasswordLimiter } = require("../middlewares/rateLimiter");
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUsersByRole,
  getUserProfile,
  refreshToken,
  logoutUser,
  filterUsers,
  resetPassword,
  updateUserProfile,
} = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { roleMiddleware } = require("../middlewares/roleMiddleware");
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/', authMiddleware, roleMiddleware(['Project Manager', 'Director']), getAllUsers);
router.get('/role/:role', authMiddleware, roleMiddleware(['Project Manager', 'Director']), getUsersByRole);
router.get('/filter', authMiddleware, filterUsers);
router.put('/password', authMiddleware, resetPassword);
router.put(
  "/password",
  resetPasswordLimiter,
  authMiddleware,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters long"),
    body("confirmPassword")
      .custom((value, { req }) => value === req.body.newPassword)
      .withMessage("Passwords do not match"),
  ],
  resetPassword
);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);

module.exports = router;
