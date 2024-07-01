const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { 
    getProjects, 
    createProject, 
    getProjectById, 
    updateProject, 
    deleteProject 
} = require('../controllers/projectController');

// Project routes
router.route('/')
    .get(authMiddleware, getProjects)
    .post(authMiddleware, createProject);

router.route('/:id')
    .get(authMiddleware, getProjectById)
    .put(authMiddleware, updateProject)
    .delete(authMiddleware, deleteProject);

module.exports = router;
