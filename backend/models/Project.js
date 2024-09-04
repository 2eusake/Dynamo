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
  durationWeeks: {
    type: DataTypes.VIRTUAL,
    get() {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const duration = Math.round((end - start) / (7 * 24 * 60 * 60 * 1000));
      return duration;
    }
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
