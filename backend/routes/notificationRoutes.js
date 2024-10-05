const express = require("express");
const router = express.Router();
const NotificationService = require("../controllers/NotificationService");
const roleMiddleware = require("../middlewares/roleMiddleware"); // JWT middleware
const { authMiddleware } = require("../middlewares/authMiddleware");

// Protected route to generate notifications
router.get(
  "/notifications",
  authMiddleware,
  roleMiddleware,
  async (req, res) => {
    try {
      const userId = req.user.id; // Extract logged-in user's ID from req.user
      const notifications = await NotificationService.generateNotifications(
        userId
      );
      res.json(notifications);
    } catch (error) {
      console.error("Error generating notifications:", error);
      res.status(500).json({ error: "Failed to generate notifications" });
    }
  }
);

module.exports = router;
