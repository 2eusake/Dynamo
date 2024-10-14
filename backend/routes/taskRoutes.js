// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const { 
    getTasks, 
    createTask, 
    getTaskById, 
    updateTask, 
    deleteTask,
    //getUserTasks,
    getTasksByProject 
} = require('../controllers/taskController');

// Task routes
router.route('/')
    .get(authMiddleware, roleMiddleware(['Project Manager', 'Director', 'Consultant']), getTasks)    // Only Project Managers or Directors can get all tasks
    .post(authMiddleware, roleMiddleware(['Project Manager', 'Director']), createTask); // Only Project Managers can create a task

// router.route('/user')
//     .get(authMiddleware, roleMiddleware(['Consultant']), getUserTasks); // Only Consultants can get their own tasks

router.route('/:id')
    .get(authMiddleware, getTaskById) // All authenticated users can get task by ID if they are authorized
    .put(authMiddleware, roleMiddleware(['Project Manager', 'Director']), updateTask) // Only Project Managers or Directors can update tasks
    .delete(authMiddleware, roleMiddleware(['Director']), deleteTask); // Only Directors can delete tasks

router.route('/project/:projectId')
    .get(authMiddleware, roleMiddleware(['Project Manager', 'Director', 'Consultant']), getTasksByProject); // Only Project Managers or Directors can get tasks by project

module.exports = router;
