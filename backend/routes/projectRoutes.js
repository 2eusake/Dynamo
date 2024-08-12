const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { 
    getProjects, 
    createProject, 
    getProjectById, 
    updateProject, 
    deleteProject,
    getUserProjects 
} = require('../controllers/projectController');

// Project routes
router.route('/')
    .get(authMiddleware, getProjects) // Get all projects
    .post(authMiddleware, createProject); // Create a new project

router.route('/user-projects') // New route for user-specific projects
    .get(authMiddleware, getUserProjects);

router.route('/:id')
    .get(authMiddleware, getProjectById) // Get project by ID
    .put(authMiddleware, updateProject) // Update project by ID
    .delete(authMiddleware, deleteProject); // Delete project by ID

module.exports = router;
