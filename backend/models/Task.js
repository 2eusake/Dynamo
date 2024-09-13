const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  taskName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'task_name',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'due_date',
  },
  hoursAllocated: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'hours_allocated',
  },
  status: {
    type: DataTypes.ENUM('pending', 'in progress', 'completed'),
    allowNull: false,
    defaultValue: 'pending',
  },
  assignedToUserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'assigned_to_user_id',
    references: {
      model: 'Users',  // Foreign key to the Users table for task assignment
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'project_id',
    references: {
      model: 'Projects',  // Foreign key to the Projects table
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
    field: 'updated_at',
  },
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (task) => {
      const assignedUser = await User.findByPk(task.assignedToUserId);
      if (assignedUser && assignedUser.role !== 'consultant') {
        throw new Error('Only consultants can be assigned to tasks.');
      }
    },
    beforeUpdate: async (task) => {
      const assignedUser = await User.findByPk(task.assignedToUserId);
      if (assignedUser && assignedUser.role !== 'consultant') {
        throw new Error('Only consultants can be assigned to tasks.');
      }
    },
  },
});

module.exports = Task;
