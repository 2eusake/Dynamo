const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  assigned_to_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users', // Name of the users table
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  status: {
    type: DataTypes.ENUM('notStarted', 'inProgress', 'completed', 'onHold'),
    allowNull: false,
    defaultValue: 'notStarted'
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'projects', 
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW
  }
});

module.exports = Task;
