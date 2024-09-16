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
    .get(authMiddleware, roleMiddleware(['Project Manager', 'Director']), getProjects) // Only PMs and Directors can view all projects
    .post(authMiddleware, roleMiddleware(['Project Manager']), createProject); // Only PMs can create a project

router.route('/:id')
    .get(authMiddleware, getProjectById) // All users can view project details
    .put(authMiddleware, roleMiddleware(['Project Manager', 'Director']), updateProject)  // Only PMs and Directors can update projects
    .delete(authMiddleware, roleMiddleware(['Director']), deleteProject); // Only Directors can delete projects

router.route('/user/:userId')
    .get(authMiddleware, roleMiddleware(['Consultant', 'Project Manager', 'Director']), getProjectsByUser); // All roles can view projects they're assigned to

module.exports = router;
