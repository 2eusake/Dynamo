const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');  
const Task = require('./Task');  
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
      if (this.startDate && this.endDate) {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const duration = Math.round((end - start) / (7 * 24 * 60 * 60 * 1000));
        return duration > 0 ? duration : 0;
      }
      return null;
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
}, {
  timestamps: true
});

module.exports = Project;
