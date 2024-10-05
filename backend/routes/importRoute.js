const express = require("express");
const router = express.Router();
const multer = require("multer");
const importController = require("../controllers/importController");

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/import",
  upload.single("excelFile"),
  importController.importExcel
);
router.get("/history", importController.getImportHistory);

module.exports = router;
