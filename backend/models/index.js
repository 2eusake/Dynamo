// models/index.js

const sequelize = require('../config/database');
const Project = require('./Project');
const Task = require('./Task');
const User = require('./User');

// Set up associations here
Project.hasMany(Task, { as: 'tasks', foreignKey: 'project_id' });
Task.belongsTo(Project, { foreignKey: 'project_id' });

User.hasMany(Project, { foreignKey: 'userId' });
Project.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Task, { foreignKey: 'assigned_to_user_id' });
Task.belongsTo(User, { foreignKey: 'assigned_to_user_id' });

User.hasMany(Project, { foreignKey: 'projectManagerId', as: 'managedProjects' });
Project.belongsTo(User, { foreignKey: 'projectManagerId', as: 'projectManager' });

module.exports = {
  Project,
  Task,
  User,
  sequelize,
};
