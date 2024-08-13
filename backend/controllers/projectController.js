const { Project, Task } = require('../models');
const sequelize = require('../config/database')


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

const createProject = async (req, res) => {
    const { name, description, startDate, endDate, status, projectManagerId, tasks } = req.body;
    const transaction = await sequelize.transaction();
    try {
        // Create a new project associated with the logged-in user
        const project = await Project.create({ 
            name, 
            description, 
            startDate,
            endDate,
            status: status || 'active', // Default to 'active' if not provided
            projectManagerId,
            userId: req.user.id 
        }, { transaction });

        if (tasks && tasks.length) {
            const taskPromises = tasks.map(task => 
                Task.create({ 
                    name: task.name, 
                    description: task.description,
                    due_date: task.due_date, 
                    assigned_to_user_id: task.assigned_to_user_id, 
                    project_id: project.id 
                }, { transaction })
            );
            await Promise.all(taskPromises);
        }

        await transaction.commit();
        res.status(201).json(project);
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

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

const updateProject = async (req, res) => {
    const { name, description, startDate, endDate, status, projectManagerId, tasks } = req.body;
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
        project.status = status || project.status;
        project.projectManagerId = projectManagerId || project.projectManagerId;
        await project.save({ transaction });

        // Delete existing tasks and recreate them if provided
        if (tasks && tasks.length) {
            await Task.destroy({ where: { project_id: project.id }, transaction });

            const taskPromises = tasks.map(task => 
                Task.create({ 
                    name: task.name, 
                    description: task.description,
                    due_date: task.due_date, 
                    assigned_to_user_id: task.assigned_to_user_id, 
                    project_id: project.id 
                }, { transaction })
            );

            await Promise.all(taskPromises);
        }

        await transaction.commit();
        res.json(project);
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
};

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

module.exports = {
    getProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
};
