const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUsersByRole,
  getUserProfile,
  refreshToken,
  logoutUser,
  updateUserProfile,
  getAllProjectManagers,
  getAllConsultants,
  getProjectManager,
  getConsultant,
} = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { roleMiddleware } = require("../middlewares/roleMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["Project Manager", "Director"]),
  getAllUsers
);
router.get(
  "/role/:role",
  authMiddleware,
  roleMiddleware(["Project Manager", "Director"]),
  getUsersByRole
);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.get("/project-managers", authMiddleware, getAllProjectManagers);
router.get("/consultants", authMiddleware, getAllConsultants);
router.get("/project-managers/:id", authMiddleware, getProjectManager);
router.get("/consultants/:id", authMiddleware, getConsultant);

module.exports = router;
