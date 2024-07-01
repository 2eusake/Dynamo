const Task = require('../models/Task');

const getTasks = async (req, res) => {
    const tasks = await Task.find({ consultantId: req.user.id });
    res.json(tasks);
};

const createTask = async (req, res) => {
    const { name, description, projectId } = req.body;
    const task = new Task({ name, description, projectId, consultantId: req.user.id });
    await task.save();
    res.status(201).json(task);
};

const getTaskById = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
};

const updateTask = async (req, res) => {
    const { name, description } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    task.name = name || task.name;
    task.description = description || task.description;
    await task.save();
    res.json(task);
};

const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    await task.remove();
    res.json({ message: 'Task removed' });
};

module.exports = {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
};
