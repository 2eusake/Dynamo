const Task = require('../models/Task');

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: { assigned_to: req.user.id }
        });
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createTask = async (req, res) => {
    try {
        const { name, description, project_id } = req.body;
        const task = await Task.create({
            name,
            description,
            project_id,
            assigned_to: req.user.id
        });
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateTask = async (req, res) => {
    try {
        const { name, description, status, due_date } = req.body;
        const [updated] = await Task.update(
            { name, description, status, due_date },
            { where: { id: req.params.id } }
        );
        if (!updated) return res.status(404).json({ message: 'Task not found' });

        const updatedTask = await Task.findByPk(req.params.id);
        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const deleted = await Task.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ message: 'Task not found' });

        res.json({ message: 'Task removed' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: { assigned_to_user_id: req.user.id }
        });
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching user tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    getUserTasks,
};
