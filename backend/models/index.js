const sequelize = require('../config/database');
const Project = require('./Project');
const Task = require('./Task');
const User = require('./User');

// Project and Task associations
Project.hasMany(Task, {
  as: 'tasks',
  foreignKey: 'project_id',
  onDelete: 'CASCADE',
  constraints: false,
});
Task.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'project',
  constraints: false,
});

// User and Task associations
User.hasMany(Task, {
  foreignKey: 'assigned_to_user_id',
  as: 'assignedTasks',
  constraints: false,
});
Task.belongsTo(User, {
  foreignKey: 'assigned_to_user_id',
  as: 'assignedToUser',
  constraints: false,
});

// User and Project associations
User.hasMany(Project, {
  foreignKey: 'project_manager_id',
  as: 'managedProjects',
  constraints: false,
});
Project.belongsTo(User, {
  foreignKey: 'project_manager_id',
  as: 'projectManager',
  constraints: false,
});

// User and Project associations for Director
User.hasMany(Project, {
  foreignKey: 'director_id',
  as: 'directedProjects',
  constraints: false,
});
Project.belongsTo(User, {
  foreignKey: 'director_id',
  as: 'projectDirector',
  constraints: false,
});

module.exports = {
  Project,
  Task,
  User,
  sequelize,
};
