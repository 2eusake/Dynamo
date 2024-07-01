const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { 
    getTasks, 
    createTask, 
    getTaskById, 
    updateTask, 
    deleteTask 
} = require('../controllers/taskController');

// Task routes
router.route('/')
    .get(authMiddleware, getTasks)
    .post(authMiddleware, createTask);

router.route('/:id')
    .get(authMiddleware, getTaskById)
    .put(authMiddleware, updateTask)
    .delete(authMiddleware, deleteTask);

module.exports = router;
