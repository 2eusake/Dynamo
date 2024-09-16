const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  hours: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'hours_allocated',
  },
  taskId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'task_id',
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
      model: 'Users',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'project_id',
    references: {
      model: 'Projects',
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
});

module.exports = Task;
