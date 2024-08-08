const { Project, Task, sequelize } = require('../models/Project');

// Controller to get all projects for the logged-in user
const getProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({ 
            where: { userId: req.user.id },
            include: [{ model: Task, as: 'tasks' }]
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
};

// Controller to create a new project
const createProject = async (req, res) => {
    const { name, description, startDate, endDate, budget, projectManager, tasks } = req.body;
    const transaction = await sequelize.transaction();
    try {
        const project = await Project.create({ 
            name, 
            description, 
            startDate, 
            endDate, 
            budget, 
            projectManager, 
            userId: req.user.id 
        }, { transaction });

        const taskPromises = tasks.map(task => 
            Task.create({ 
                name: task.name, 
                dueDate: task.dueDate, 
                assignedTo: task.assignedTo, 
                projectId: project.id 
            }, { transaction })
        );

        await Promise.all(taskPromises);
        await transaction.commit();

        res.status(201).json(project);
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

// Controller to get a specific project by ID
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({ 
            where: { id: req.params.id, userId: req.user.id },
            include: [{ model: Task, as: 'tasks' }]
        });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error: error.message });
    }
};

// Controller to update an existing project
const updateProject = async (req, res) => {
    const { name, description, startDate, endDate, budget, projectManager, tasks } = req.body;
    const transaction = await sequelize.transaction();
    try {
        const project = await Project.findOne({ 
            where: { id: req.params.id, userId: req.user.id } 
        });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        project.name = name || project.name;
        project.description = description || project.description;
        project.startDate = startDate || project.startDate;
        project.endDate = endDate || project.endDate;
        project.budget = budget || project.budget;
        project.projectManager = projectManager || project.projectManager;
        await project.save({ transaction });

        await Task.destroy({ where: { projectId: project.id }, transaction });

        const taskPromises = tasks.map(task => 
            Task.create({ 
                name: task.name, 
                dueDate: task.dueDate, 
                assignedTo: task.assignedTo, 
                projectId: project.id 
            }, { transaction })
        );

        await Promise.all(taskPromises);
        await transaction.commit();

        res.json(project);
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
};

// Controller to delete a project
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findOne({ 
            where: { id: req.params.id, userId: req.user.id } 
        });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        await project.destroy();
        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
};

// Controller to get projects based on the logged-in user
const getUserProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({
            where: { userId: req.user.id },
            include: [{ model: Task, as: 'tasks' }]
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user projects', error: error.message });
    }
};

module.exports = {
    getProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    getUserProjects,
};
