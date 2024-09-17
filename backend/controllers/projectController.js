const { Project, Task, User } = require("../models");
const sequelize = require("../config/database");

const getProjects = async (req, res) => {
  try {
    const condition = req.user.role === 'Director' 
      ? {} 
      : { [sequelize.Op.or]: [{ projectManagerId: req.user.id }, { userId: req.user.id }] };

    const projects = await Project.findAll({
      where: condition,
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
    //description,
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
    const project = await Project.create(
      {
        wbsElement,
        name,
        //description,
        startDate,
        endDate,
        duration,
        status: status || "not started",
        projectManagerId,
        directorId,
        userId: req.user.id,
      },
      { transaction }
    );

    if (tasks && tasks.length) {
      const taskPromises = tasks.map((task) =>
        Task.create(
          {
            taskId: task.taskId, 
            name: task.taskName,
            description: task.description,
            start_date: task.start_date,
            due_date: task.due_date,
            hours:task.hours,
            assigned_to_user_id: task.assigned_to_user_id,
            project_id: project.id,
          },
          { transaction }
        )
      );
      await Promise.all(taskPromises);
    }

    await transaction.commit();
    res.status(201).json(project);
  } catch (error) {
    await transaction.rollback();
    res
      .status(500)
      .json({ message: "Error creating project", error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, userId: req.user.id },
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
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching project", error: error.message });
  }
};

const updateProject = async (req, res) => {
  const {
    wbsElement,
    name,
    description,
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
    const project = await Project.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.wbsElement = wbsElement || project.wbsElement;
    project.name = name || project.name;
    project.description = description || project.description;
    project.startDate = startDate || project.startDate;
    project.endDate = endDate || project.endDate;
    project.duration = duration || project.duration;
    project.status = status || project.status;
    project.projectManagerId = projectManagerId || project.projectManagerId;
    project.directorId = directorId || project.directorId;
    await project.save({ transaction });

    if (tasks && tasks.length) {
      await Task.destroy({ where: { project_id: project.id }, transaction });
      const taskPromises = tasks.map((task) =>
        Task.create(
          {
            taskId: task.taskId,
            name: task.taskName,
            description: task.description,
            start_date: task.start_date,
            due_date: task.due_date,
            hours: task.hours,
            assigned_to_user_id: task.assigned_to_user_id,
            project_id: project.id,
          },
          { transaction }
        )
      );
      await Promise.all(taskPromises);
    }

    await transaction.commit();
    res.json(project);
  } catch (error) {
    await transaction.rollback();
    res
      .status(500)
      .json({ message: "Error updating project", error: error.message });
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

module.exports = {
  getProjects,
  getProjectsByUser,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};
