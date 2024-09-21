const Project = require('../models/Project');
const Task = require('../models/Task');

// Get report data for projects and tasks
exports.getReports = async (req, res) => {
  try {
    // Fetch all projects with related task data
    const projects = await Project.findAll({
      include: [{
        model: Task, // Include associated tasks
        as: 'tasks', // Alias if using associations
      }],
    });

    // Fetch all tasks separately if needed
    const tasks = await Task.findAll();

    // Generate summary for reports
    const totalProjects = projects.length;
    const activeProjects = projects.filter(project => project.status === 'in progress').length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const overdueTasks = tasks.filter(task => new Date(task.due_date) < new Date() && task.status !== 'completed').length;

    // Send report data to the frontend
    res.status(200).json({
      totalProjects,
      activeProjects,
      completedTasks,
      overdueTasks,
      projects,
      tasks,
    });
  } catch (error) {
    console.error('Error generating reports:', error);
    res.status(500).json({ message: 'Failed to generate reports' });
  }
};
