const xlsx = require("xlsx");
const { Project, Task, User } = require("../models");
const { Op } = require("sequelize");

class importController {
  async importExcel(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });

      // Process first sheet (Timesheet)
      const timesheetSheet = workbook.Sheets[workbook.SheetNames[0]];
      const timesheetData = xlsx.utils.sheet_to_json(timesheetSheet);

      // Process second sheet (Task Codes)
      const taskCodesSheet = workbook.Sheets[workbook.SheetNames[1]];
      const taskCodesData = xlsx.utils.sheet_to_json(taskCodesSheet);

      // Create a map of Task ID to Description
      const taskDescriptions = new Map(
        taskCodesData.map((row) => [row["Task ID"], row["Description"]])
      );

      for (const row of timesheetData) {
        const {
          "Posting Date": postingDate,
          "SAP Code": taskId,
          "Quantity/Hours": actualHours,
          "Employee Name": employeeName,
          "WBS Element/Project ID": wbsElement,
        } = row;

        // Find or create the project
        const [project] = await Project.findOrCreate({
          where: { wbsElement },
          defaults: { name: `Project ${wbsElement}` },
        });

        // Find the user (employee)
        const user = await User.findOne({ where: { username: employeeName } });
        if (!user) {
          console.warn(`User not found: ${employeeName}`);
          continue;
        }

        // Find or create the task
        const [task] = await Task.findOrCreate({
          where: { taskId, projectId: project.id },
          defaults: {
            taskName: taskDescriptions.get(taskId) || `Task ${taskId}`,
            description: taskDescriptions.get(taskId),
            hours: actualHours, // Set initial hours
            assigned_to_user_id: user.id,
          },
        });

        // Update actual hours
        await task.update({
          actualHours: task.actualHours
            ? task.actualHours + parseFloat(actualHours)
            : parseFloat(actualHours),
        });
      }

      res.status(200).json({ message: "Excel data imported successfully" });
    } catch (error) {
      console.error("Error importing Excel data:", error);
      res
        .status(500)
        .json({ message: "Error importing Excel data", error: error.message });
    }
  }

  async getImportHistory(req, res) {
    try {
      const recentUpdates = await Task.findAll({
        attributes: ["id", "taskId", "taskName", "actualHours", "updatedAt"],
        include: [
          {
            model: Project,
            attributes: ["name", "wbsElement"],
            as: "project", // Add this line to specify the alias
          },
          {
            model: User,
            attributes: ["username"],
            as: "assignedToUser",
          },
        ],
        order: [["updatedAt", "DESC"]],
        limit: 50,
      });

      res.status(200).json(recentUpdates);
    } catch (error) {
      console.error("Error fetching import history:", error);
      res.status(500).json({
        message: "Error fetching import history",
        error: error.message,
      });
    }
  }
}

module.exports = new importController();
