// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
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
    .get(authMiddleware, roleMiddleware(['project_manager', 'director']), getProjects) // Only PMs and Directors can view all projects
    .post(authMiddleware, roleMiddleware(['project_manager']), createProject); // Only PMs can create a project

router.route('/:id')
    .get(authMiddleware, getProjectById) // All users can view project details
    .put(authMiddleware, roleMiddleware(['project_manager', 'director']), updateProject)  // Only PMs and Directors can update projects
    .delete(authMiddleware, roleMiddleware(['director']), deleteProject); // Only Directors can delete projects

router.route('/user/:userId')
    .get(authMiddleware, roleMiddleware(['consultant', 'project_manager', 'director']), getProjectsByUser); // All roles can view projects they're assigned to

module.exports = router;
