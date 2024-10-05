const Task = require('../models/Task');

// Get all tasks assigned to the user (or all tasks if director)
const getTasks = async (req, res) => {
  try {
    const condition = req.user.role === 'Director' ? {} : { assigned_to_user_id: req.user.id };
    const tasks = await Task.findAll({ where: condition });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Get all tasks for a specific project (restricted based on role)
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.findAll({ where: { project_id: projectId } });
    if (req.user.role !== 'Director') {
      tasks = tasks.filter(task => task.assigned_to_user_id === req.user.id);
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks for the project', error: error.message });
  }
};

// Create a new task (only accessible to project managers and directors)
const createTask = async (req, res) => {
  if (req.user.role !== 'Project Manager' && req.user.role !== 'Director') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    // Destructure from the request body
    const { taskId, taskName, description, project_id, start_date, due_date, hours } = req.body;

    // Ensure task name is provided
    if (!taskName) {
      return res.status(400).json({ message: 'Task name is required' });
    }

    // Create the task
    const task = await Task.create({
      taskId,
      taskName,
      description,
      project_id,
      start_date,
      due_date,
      hours,
      assigned_to_user_id: req.user.id,
      status: 'pending', // Default status
    });

    console.log('Request body:', req.body); // Add this to log the incoming task data


    // Return the created task as a response
    res.status(201).json(task);

  } catch (error) {
    // Return an error if something goes wrong
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};


// Get a task by ID (restricted based on role)
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task || (req.user.role !== 'Director' && task.assigned_to_user_id !== req.user.id)) {
      return res.status(404).json({ message: 'Task not found or access denied' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
};

// Update a task (restricted to task assignee, project manager, or director)
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task || (req.user.role !== 'Director' && task.assigned_to_user_id !== req.user.id)) {
      return res.status(404).json({ message: 'Task not found or access denied' });
    }

    const { taskName, description, status, start_date, due_date } = req.body;
    await task.update({ taskName, description, status, start_date, due_date, hours,actualHours });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// Delete a task (restricted to project manager or director)
const deleteTask = async (req, res) => {
  if (req.user.role !== 'Project Manager' && req.user.role !== 'Director') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.destroy();
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByProject,
};
