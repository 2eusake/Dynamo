const express = require('express');
const sequelize = require('./config/database'); 
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { processExcelFile } = require('../controllers/processExcelFile');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api', uploadRoutes); 

const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');


// Project.hasMany(Task, { foreignKey: 'project_id', as: 'tasks' });
// Task.belongsTo(Project, { foreignKey: 'project_id' });

// User.hasMany(Task, { foreignKey: 'assigned_to_user_id', as: 'tasks' });
// Task.belongsTo(User, { foreignKey: 'assigned_to_user_id' });

// User.hasMany(Project, { foreignKey: 'userId', as: 'projects' });
// Project.belongsTo(User, { foreignKey: 'userId' });

// User.hasMany(Project, { foreignKey: 'projectManagerId', as: 'managedProjects' });
// Project.belongsTo(User, { foreignKey: 'projectManagerId', as: 'projectManager' });

const PORT = process.env.PORT || 5000;

sequelize.sync() 
  .then(() => {
    console.log('Database synced son');
    app.listen(PORT, () => {
      console.log(`Server running on port 2eus_ ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });
