const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
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
  startDate: {
    type: DataTypes.DATE,
    field: 'start_date',
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    field: 'end_date',
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'onHold'),
    allowNull: false,
    defaultValue: 'active'
  },
  projectManagerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'projectManagerId',
    references: {
      model: 'users', 
      key: 'id'
    }
  },
  
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', 
      key: 'id'
    }
  }
});

//Project.hasMany(Task, { as: 'tasks', foreignKey: 'project_id' });

module.exports = Project;
