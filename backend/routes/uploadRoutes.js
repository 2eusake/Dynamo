// routes/uploadRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Define the upload route
router.post(
  '/upload',
  authMiddleware,
  roleMiddleware(['Project Manager', 'Director']), // Adjust roles as needed
  upload.single('file'),
  uploadController.processUpload
);

module.exports = router;
