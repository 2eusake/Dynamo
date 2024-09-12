const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');  // Import the User model for validation

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  task_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  hours_allocated: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'in progress', 'completed'),
    allowNull: false,
    defaultValue: 'pending',
  },
  assigned_to_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',  // Foreign key to the users table for task assignment
      key: 'id',
    },
    onDelete: 'SET NULL',  // If the assigned user is deleted, set this field to null
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projects',  // Foreign key to the projects table
      key: 'id',
    },
    onDelete: 'CASCADE',  // If the project is deleted, delete related tasks
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
}, {
  timestamps: true,
  hooks: {
    // Ensure that only consultants can be assigned to tasks
    beforeCreate: async (task) => {
      const assignedUser = await User.findByPk(task.assigned_to_user_id);
      if (assignedUser && assignedUser.role !== 'consultant') {
        throw new Error('Only consultants can be assigned to tasks.');
      }
    },
    beforeUpdate: async (task) => {
      const assignedUser = await User.findByPk(task.assigned_to_user_id);
      if (assignedUser && assignedUser.role !== 'consultant') {
        throw new Error('Only consultants can be assigned to tasks.');
      }
    },
  },
});

module.exports = Task;
