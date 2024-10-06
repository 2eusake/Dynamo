const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get(
  "/consultant-performance",
  authMiddleware,
  reportController.getConsultantPerformance
);

module.exports = router;
