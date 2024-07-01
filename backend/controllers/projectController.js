const Project = require('../models/Project');

const getProjects = async (req, res) => {
    const projects = await Project.find({ consultantId: req.user.id });
    res.json(projects);
};

const createProject = async (req, res) => {
    const { name, description } = req.body;
    const project = new Project({ name, description, consultantId: req.user.id });
    await project.save();
    res.status(201).json(project);
};

const getProjectById = async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
};

const updateProject = async (req, res) => {
    const { name, description } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    project.name = name || project.name;
    project.description = description || project.description;
    await project.save();
    res.json(project);
};

const deleteProject = async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    await project.remove();
    res.json({ message: 'Project removed' });
};

module.exports = {
    getProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
};
