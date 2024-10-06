const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/notificationController");
const isAuthenticated = require("../middlewares/isAuthenticated");
router.get(
  "/:userId",
  isAuthenticated,
  NotificationController.generateNotifications
);

router.patch(
  "/:notificationId/read",
  isAuthenticated,
  NotificationController.markAsRead
);

router.delete(
  "/:notificationId",
  isAuthenticated,
  NotificationController.deleteNotification
);

router.get(
  "/:userId/all",
  isAuthenticated,
  NotificationController.getAllNotifications
);

module.exports = router;
