const sequelize = require('../config/database');
const Project = require('./Project');
const Task = require('./Task');
const User = require('./User');




Project.hasMany(Task, { 
  as: 'tasks',  
  foreignKey: 'project_id', 
  onDelete: 'CASCADE',  
  constraints: false    
});
Task.belongsTo(Project, { 
  foreignKey: 'project_id', 
  as: 'project',  
  constraints: false  
});


User.hasMany(Task, { 
  foreignKey: 'assigned_to_user_id', 
  as: 'assignedTasks',  
  constraints: false 
});
Task.belongsTo(User, { 
  foreignKey: 'assigned_to_user_id', 
  as: 'assignedToUser',  
  constraints: false  
});


User.hasMany(Project, { 
  foreignKey: 'projectManagerId', 
  as: 'managedProjects',  
  constraints: false  
});
Project.belongsTo(User, { 
  foreignKey: 'projectManagerId', 
  as: 'projectManager',  
  constraints: false 
});

module.exports = {
  Project,
  Task,
  User,
  sequelize,
};
