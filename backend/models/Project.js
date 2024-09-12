const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  wbs_element: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // Unique WBS Element
  },
  startDate: {
    type: DataTypes.DATE,
    field: 'start_date',
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATE,
    field: 'end_date',
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('not started', 'in progress', 'completed'),
    allowNull: false,
    defaultValue: 'not started',
  },
  projectManagerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'project_manager_id',  // Match the column name in the database
    references: {
      model: 'users',  // Foreign key to the users table for project manager
      key: 'id',
    },
    onDelete: 'SET NULL',  // Same as in your SQL schema
    onUpdate: 'CASCADE',
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
  underscored: true,  // Ensure that Sequelize converts camelCase to snake_case
});

module.exports = Project;
