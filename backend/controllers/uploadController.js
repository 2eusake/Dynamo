// controllers/uploadController.js

const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Task = require('../models/Task');

exports.processUpload = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    // Step 1: Read the Excel file
    const filePath = path.join(__dirname, '..', file.path);
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
    const worksheet = workbook.Sheets[sheetName];

    // Convert the worksheet to JSON
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Step 2: Map Employee Names to User IDs
    const users = await User.findAll({
      attributes: ['id', 'username'],
    });

    const userMapping = {};
    users.forEach(user => {
      const username = user.username.trim().toLowerCase();
      userMapping[username] = user.id;
    });

    // Step 3: Process each row in the data
    for (const row of data) {
      const employeeName = row['Employee Name'] ? row['Employee Name'].trim().toLowerCase() : '';
      const taskName = row['Journal Entry Item Text/Task'] ? row['Journal Entry Item Text/Task'].trim() : '';
      const quantityHours = parseFloat(row['Quantity/Hours']);

      if (!employeeName || !taskName || isNaN(quantityHours)) {
        console.log('Invalid data in row:', row);
        continue; // Skip invalid rows
      }

      const userId = userMapping[employeeName];
      if (!userId) {
        console.log(`User '${employeeName}' not found.`);
        continue; // Skip or handle accordingly
      }

      // Corrected: Use model property names in the where clause
      const tasks = await Task.findAll({
        where: {
          taskName: taskName,
          assigned_to_user_id: userId, // This is the model property name
        }
      });

      if (tasks.length > 0) {
        // Update the actualHours for the first matched task
        const task = tasks[0];
        task.actualHours = (task.actualHours || 0) + quantityHours;
        await task.save();
      } else {
        console.log(`No tasks found for task '${taskName}' assigned to user ID '${userId}'.`);
      }
    }

    // Delete the uploaded file
    fs.unlinkSync(filePath);

    res.send('File processed successfully.');
  } catch (error) {
    console.error('Error in processUpload:', error);
    res.status(500).send('An error occurred while processing the file.');
  }
};
