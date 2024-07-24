const express = require('express');
const sequelize = require('./config/database'); 
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000' }));

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync() 
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server running on port 2eus_ ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });
