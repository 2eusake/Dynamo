const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const { Project, Task, User } = require('./models');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const findUserIdByName = async (username) => {
    const user = await User.findOne({ where: { username } });
    return user ? user.id : null;
};

const findOrCreateProject = async (wbsCode) => {
    let project = await Project.findOne({ where: { wbs_element: wbsCode } });
    if (!project) {
        // Create project if it does not exist
        project = await Project.create({
            name: `Project for ${wbsCode}`, // Provide default or extract from data if available
            description: `Description for project ${wbsCode}`, // Provide default or extract from data if available
            wbs_element: wbsCode
        });
    }
    return project;
};

const extractHours = (quantityHours) => {
    const match = quantityHours.match(/^([\d\.]+) H$/);
    return match ? parseFloat(match[1]) : 0;
};

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        for (let row of sheetData) {
            const { 'Posting Date': postingDate, 'Journal Entry Item Text/Task': taskName, 'Quantity/Hours': quantityHours, 'Employee Name': employee, 'WBS Element/Project ID': wbsCode } = row;

            const assignedToUserId = await findUserIdByName(employee);
            if (!assignedToUserId) {
                console.warn(`User not found: ${employee}`);
                continue;
            }

            const project = await findOrCreateProject(wbsCode);
            if (!project) {
                console.warn(`Project not found or created for WBS Code: ${wbsCode}`);
                continue;
            }

            await Task.create({
                task_name: taskName,
                hours_allocated: extractHours(quantityHours),
                due_date: null, // or any appropriate logic
                assigned_to_user_id: assignedToUserId,
                project_id: project.id,
                createdAt: postingDate,
            });
        }

        res.status(200).send('File uploaded and data saved successfully.');
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
