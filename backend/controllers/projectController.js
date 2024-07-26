const Project = require('../models/Project');

const getProjects = async (req, res) => {
    try {
        // Fetch projects associated with the logged-in user
        const projects = await Project.findAll({ 
            where: { userId: req.user.id }
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error });
    }
};

const createProject = async (req, res) => {
    try {
        const { name, description, startDate, endDate } = req.body;
        // Create a new project associated with the logged-in user
        const project = await Project.create({ 
            name, 
            description, 
            startDate,
            endDate,
            userId: req.user.id 
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({ 
            where: { id: req.params.id, userId: req.user.id } 
        });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error });
    }
};

const updateProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const project = await Project.findOne({ 
            where: { id: req.params.id, userId: req.user.id } 
        });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        project.name = name || project.name;
        project.description = description || project.description;
        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error });
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
        res.status(500).json({ message: 'Error deleting project', error });
    }
};

module.exports = {
    getProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
};
