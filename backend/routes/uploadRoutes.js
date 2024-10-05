const express = require('express');
const multer = require('multer');
const { processExcelFile } = require('../controllers/processExcelFile');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', authMiddleware, roleMiddleware(['Director', 'Project Manager']), upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        // Call processExcelFile to handle the uploaded file
        await processExcelFile(file.path);

        res.status(200).send('File uploaded and data saved successfully.');
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
