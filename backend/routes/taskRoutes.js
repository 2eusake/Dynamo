const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { 
    getTasks, 
    createTask, 
    getTaskById, 
    updateTask, 
    deleteTask,
    getUserTasks,
    getTasksByProject 
} = require('../controllers/taskController');

// Task routes
router.route('/')
    .get(authMiddleware, getTasks)    // Route to get all tasks (possibly admin use case)
    .post(authMiddleware, createTask); // Route to create a new task

router.route('/user') // Route to get tasks for the logged-in user
    .get(authMiddleware, getUserTasks);

router.route('/:id')
    .get(authMiddleware, getTaskById)
    .put(authMiddleware, updateTask)
    .delete(authMiddleware, deleteTask);

router.route('/project/:projectId')
    .get(authMiddleware, getTasksByProject);

module.exports = router;
