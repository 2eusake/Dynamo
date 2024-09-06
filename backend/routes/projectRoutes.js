



const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { 
    getProjects, 
    createProject, 
    getProjectById, 
    updateProject, 
    deleteProject,
    getProjectsByUser 
} = require('../controllers/projectController');

// Project routes
router.route('/')
    .get(authMiddleware, getProjects) // Get all projects
    .post(authMiddleware, createProject); // Create a new project

router.route('/:id')
    .get(authMiddleware, getProjectById) // Get project by ID
    .put(authMiddleware, updateProject) // Update project by ID
    .delete(authMiddleware, deleteProject); // Delete project by ID

router.route('/user')
    .get(authMiddleware, getProjectsByUser);

    
module.exports = router;
