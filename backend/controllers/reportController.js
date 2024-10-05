// const Project = require('../models/Project');
// const Task = require('../models/Task');
// const { Op } = require('sequelize');

// exports.getReports = async (req, res) => {
//   try {
//     // Fetch all projects with related task data
//     const projects = await Project.findAll({
//       include: [{
//         model: Task,
//         as: 'tasks',
//         attributes: ['id', 'name', 'status', 'due_date', 'projectId'],  // Ensure due_date and status are included
//       }],
//       attributes: ['id', 'name', 'wbsElement', 'startDate', 'endDate', 'progress', 'status'],
//     });

//     // Generate summary for reports
//     const totalProjects = projects.length;
//     const activeProjects = projects.filter(project => project.status === 'in progress').length;

//     // Calculate completed tasks and overdue tasks
//     const completedTasks = projects.reduce((sum, project) =>
//       sum + project.tasks.filter(task => task.status === 'completed').length, 0);

//     const overdueTasks = projects.reduce((sum, project) =>
//       sum + project.tasks.filter(task =>
//         task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'
//       ).length, 0);

//     // Generate progress data for the last 7 days
//     const progressData = generateProgressData(projects);

//     // Send report data to the frontend
//     res.status(200).json({
//       stats: {
//         totalProjects,
//         activeProjects,
//         completedTasks,
//         overdueTasks,
//       },
//       projects,
//       progressData,
//     });
//   } catch (error) {
//     console.error('Error generating reports:', error);
//     res.status(500).json({ message: 'Failed to generate reports' });
//   }
// };

// // Helper function to generate progress data
// function generateProgressData(projects) {
//   const data = [];
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);  // Ensure we work with 00:00 for date comparison

//   // Loop through the last 7 days
//   for (let i = 6; i >= 0; i--) {
//     const date = new Date(today);
//     date.setDate(today.getDate() - i);
//     const dateString = date.toISOString().split('T')[0]; // Get date as YYYY-MM-DD

//     // Filter projects active during this date range
//     const relevantProjects = projects.filter(project => 
//       new Date(project.startDate) <= date && new Date(project.endDate) >= date
//     );

//     // Sum the progress of relevant projects
//     const totalProgress = relevantProjects.reduce((sum, project) => sum + (project.progress || 0), 0);
//     const averageProgress = relevantProjects.length > 0 ? totalProgress / relevantProjects.length : 0;

//     // Add data point for this day
//     data.push({
//       date: dateString,
//       progress: parseFloat(averageProgress.toFixed(2)),
//     });
//   }

//   return data;
// }
const Project = require('../models/Project');
const Task = require('../models/Task');
const { Op } = require('sequelize');

exports.getReports = async (req, res) => {
  try {
    console.log("Start generating reports..."); // Add a log at the start

    // Fetch all projects with related task data
    const projects = await Project.findAll({
      include: [{
        model: Task,
        as: 'tasks',
        attributes: ['id', 'name', 'status', 'due_date', 'projectId'],
        required: false, // Add this in case some projects have no tasks
      }],
      attributes: ['id', 'name', 'wbsElement', 'startDate', 'endDate', 'progress', 'status'],
    });

    console.log("Projects and tasks fetched successfully."); // Log after fetching

    // Generate summary for reports
    const totalProjects = projects.length;
    const activeProjects = projects.filter(project => project.status === 'in progress').length;

    // Calculate completed tasks and overdue tasks
    const completedTasks = projects.reduce((sum, project) =>
      sum + project.tasks.filter(task => task.status === 'completed').length, 0);

    const overdueTasks = projects.reduce((sum, project) =>
      sum + project.tasks.filter(task =>
        task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'
      ).length, 0);

    console.log("Completed and overdue tasks calculated."); // Log after calculating

    // Generate progress data for the last 7 days
    const progressData = generateProgressData(projects);

    console.log("Progress data generated successfully."); // Log after progress generation

    // Send report data to the frontend
    res.status(200).json({
      stats: {
        totalProjects,
        activeProjects,
        completedTasks,
        overdueTasks,
      },
      projects,
      progressData,
    });
    console.log("Reports sent to the frontend successfully."); // Log before sending response
  } catch (error) {
    console.error('Error generating reports:', error.message); // Add more details to the error
    res.status(500).json({ message: 'Failed to generate reports' });
  }
};

// Helper function to generate progress data
function generateProgressData(projects) {
  const data = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Ensure we work with 00:00 for date comparison

  console.log("Generating progress data..."); // Log the start of progress data generation

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0]; // Get date as YYYY-MM-DD

    // Filter projects active during this date range
    const relevantProjects = projects.filter(project => 
      project.startDate && project.endDate &&
      new Date(project.startDate) <= date && new Date(project.endDate) >= date
    );

    // Sum the progress of relevant projects
    const totalProgress = relevantProjects.reduce((sum, project) => sum + (project.progress || 0), 0);
    const averageProgress = relevantProjects.length > 0 ? totalProgress / relevantProjects.length : 0;

    // Add data point for this day
    data.push({
      date: dateString,
      progress: parseFloat(averageProgress.toFixed(2)),
    });
  }

  console.log("Progress data generation completed."); // Log after the progress data is created

  return data;
}
