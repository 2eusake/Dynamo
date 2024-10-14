const { Project, Task, User } = require("../models");
const { Op } = require('sequelize');
const sequelize = require("../config/database");

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

    res.json(projects);
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
          as: 'projectManager',  // Alias for project manager
          attributes: ['id', 'username'], // Assuming 'username' is the attribute for displaying user names
        },
        {
          model: User,
          as: 'projectDirector',  // Alias for director
          attributes: ['id', 'username'], // Assuming 'username' is the attribute for displaying user names
        }
      ],
    });
    res.json(projects);
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
        duration,
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
            projectId: project.id, // Link task to the created project
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

    res.json(project);
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
    const project = await Project.findByPk(req.params.id);
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
      if (project.startDate && project.endDate) {
        const duration = calculateDuration(project.startDate, project.endDate);
        project.duration = duration;
      }
    }

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
    const project = await Project.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    await project.destroy();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting project", error: error.message });
  }
};
const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : null;
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
