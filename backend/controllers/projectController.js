const { Project, Task, User } = require("../models");
const { Op } = require('sequelize');
const sequelize = require("../config/database");

// Utility function to calculate project progress and status
const calculateProjectProgressAndStatus = (tasks) => {
  if (!tasks || tasks.length === 0) {
    return { progress: 0, status: 'not started' };
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status.toLowerCase() === "completed").length;
  const inProgressTasks = tasks.filter(task => task.status.toLowerCase() === "in progress").length;

  let status = 'not started';
  if (completedTasks === totalTasks) {
    status = 'completed';
  } else if (inProgressTasks > 0 || completedTasks > 0) {
    status = 'in progress';
  }

  const progress = Math.round((completedTasks / totalTasks) * 100);

  return { progress, status };
};

// Utility function to calculate project duration
const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : null;
};

const getProjects = async (req, res) => {
  try {
    let condition = {};

    if (req.user.role === 'Director') {
      if (req.query.filter === 'assigned') {
        condition = { directorId: req.user.id };
      }
    } else if (req.user.role === 'Project Manager') {
      if (req.query.filter === 'assigned') {
        condition = { projectManagerId: req.user.id };
      }
    } else if (req.user.role === 'Consultant') {
      // Consultants can see projects related to their assigned tasks
      condition = {
        id: {
          [Op.in]: sequelize.literal(`(
            SELECT DISTINCT project_id
            FROM Tasks
            WHERE assigned_to_user_id = ${req.user.id}
          )`)
        }
      };
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    const projects = await Project.findAll({
      where: condition,
      include: [
        {
          model: Task,
          as: 'tasks',
        },
        {
          model: User,
          as: 'projectManager',
          attributes: ['id', 'username'],
        },
        {
          model: User,
          as: 'projectDirector',
          attributes: ['id', 'username'],
        }
      ],
    });

    // Update project progress and status before sending response
    const projectsWithProgressAndStatus = projects.map(project => {
      const projectData = project.toJSON();
      const { progress, status } = calculateProjectProgressAndStatus(projectData.tasks);
      projectData.progress = progress;
      projectData.status = status;
      return projectData;
    });

    res.json(projectsWithProgressAndStatus);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
};

const getProjectsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.findAll({
      where: { userId },
      include: [
        {
          model: Task,
          as: 'tasks',
        },
        {
          model: User,
          as: 'projectManager',
          attributes: ['id', 'username'],
        },
        {
          model: User,
          as: 'projectDirector',
          attributes: ['id', 'username'],
        }
      ],
    });

    // Update project progress and status before sending response
    const projectsWithProgressAndStatus = projects.map(project => {
      const projectData = project.toJSON();
      const { progress, status } = calculateProjectProgressAndStatus(projectData.tasks);
      projectData.progress = progress;
      projectData.status = status;
      return projectData;
    });

    res.json(projectsWithProgressAndStatus);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const createProject = async (req, res) => {
  const {
    wbsElement,
    name,
    startDate,
    endDate,
    duration,
    status,
    projectManagerId,
    directorId,
    tasks,
  } = req.body;

  const transaction = await sequelize.transaction();
  
  try {
    // Step 1: Create the project
    const project = await Project.create(
      {
        wbsElement,
        name,
        startDate,
        endDate,
        duration: calculateDuration(startDate, endDate),
        status: status || 'not started',
        projectManagerId,
        directorId,
        userId: req.user.id,
      },
      { transaction }
    );

    // Step 2: Validate and create the tasks associated with the project
    if (tasks && tasks.length) {
      const taskPromises = tasks.map((task) => {
        if (!task.taskName) {
          throw new Error('Task name cannot be empty');
        }

        // Step 3: Create each task linked to the project ID
        return Task.create(
          {
            taskId: task.taskId,
            taskName: task.taskName,
            description: task.description,
            start_date: task.start_date,
            due_date: task.due_date,
            hours: task.hours,
            assigned_to_user_id: task.assigned_to_user_id || null,
            projectId: project.id,
          },
          { transaction }
        );
      });

      await Promise.all(taskPromises);
    }

    // Step 4: Commit the transaction
    await transaction.commit();

    // Step 5: Return the created project and tasks as a response
    res.status(201).json(project);
  } catch (error) {
    // Rollback the transaction if something goes wrong
    await transaction.rollback();

    // Return an error message
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: Task,
          as: 'tasks',
          include: [
            {
              model: User,
              as: 'assignedToUser',
              attributes: ['id', 'username'],
            },
          ],
        },
        {
          model: User,
          as: 'projectManager',
          attributes: ['id', 'username'],
        },
        {
          model: User,
          as: 'projectDirector',
          attributes: ['id', 'username'],
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const projectData = project.toJSON();
    const { progress, status } = calculateProjectProgressAndStatus(projectData.tasks);
    projectData.progress = progress;
    projectData.status = status;

    res.json(projectData);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project.' });
  }
};

const updateProject = async (req, res) => {
  const {
    wbsElement,
    name,
    startDate,
    endDate,
    status,
    projectManagerId,
    directorId,
  } = req.body;
  const transaction = await sequelize.transaction();
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: Task,
          as: 'tasks',
        },
      ],
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.wbsElement = wbsElement || project.wbsElement;
    project.name = name || project.name;
    project.startDate = startDate || project.startDate;
    project.endDate = endDate || project.endDate;
    project.status = status || project.status;
    project.projectManagerId = projectManagerId || project.projectManagerId;
    project.directorId = directorId || project.directorId;

    // Recalculate duration if dates changed
    if (startDate || endDate) {
      project.duration = calculateDuration(project.startDate, project.endDate);
    }

    // Calculate progress and update project status accordingly
    const { progress, newStatus } = calculateProjectProgressAndStatus(project.tasks);
    project.progress = progress;
    project.status = newStatus;

    await project.save({ transaction });
    await transaction.commit();

    // Fetch the updated project with associations
    const updatedProject = await Project.findByPk(req.params.id, {
      include: [
        {
          model: Task,
          as: 'tasks',
          include: [
            {
              model: User,
              as: 'assignedToUser',
              attributes: ['id', 'username'],
            },
          ],
        },
        {
          model: User,
          as: 'projectManager',
          attributes: ['id', 'username'],
        },
        {
          model: User,
          as: 'projectDirector',
          attributes: ['id', 'username'],
        },
      ],
    });

    res.json(updatedProject);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Error updating project", error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only allow project deletion by users who have appropriate permissions (e.g., Directors)
    if (req.user.role !== 'Director') {
      return res.status(403).json({ message: "Access denied" });
    }

    await project.destroy();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectsByUser,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  calculateDuration,
};
