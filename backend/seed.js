const { sequelize, Project, Task, User } = require('./models'); // Adjust the path if needed

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connection established.');

    // Disable foreign key checks to avoid constraint issues when recreating tables
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Recreate tables, drop existing ones
    await sequelize.sync({ force: true });

    console.log('Database tables recreated.');

    // Enable foreign key checks again
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Create sample users
    const users = [
      { username: 'zusakeb', email: 'bngzus001@myuct.ac.za', password: '$2a$10$NSJylvGJQeVhZf/2Cy1KYOFT8EkQNfMvvmProwgjzTWtxDJM7I36q', role: 'Director', groupName: 'General', refreshToken: 'token1' },
      { username: 'vhuhuluk', email: 'kwindavee@gmail.com', password: '$2b$10$EIOIyQIkJnXZfd96dAcTxuDFfZMeanbF7PleqXkKBnmiiMxgRnXcq', role: 'Director', groupName: 'General', refreshToken: 'token2' },
      { username: 'nicolek', email: 'nicole@gmail.com', password: '$2b$10$424aN0/YsqollnZra/VxfezXqXhPAg1k33u2Zx81OzJXDeGhqyR8i', role: 'Consultant', groupName: 'General', refreshToken: 'token3' },
      { username: 'andilems', email: 'andile@gmail.com', password: '$2b$10$cqO4iMZN6K.Afv6Fkfgjle4b6t6n/UqOG285bqtx5i2bXkcrpRGmy', role: 'Consultant', groupName: 'General', refreshToken: 'token4' },
      { username: 'concettac', email: 'concetta@gmail.com', password: '$2b$10$k/exPSo/ZLj3.Kw7inwWR..KuW/9STyD1OReLZPNwyiz96IUq.X5u', role: 'Consultant', groupName: 'General', refreshToken: 'token5' },
      { username: 'ruane', email: 'ruan@gmail.com', password: '$2b$10$F6W7lLhLH5qmj0WTQI6uIe316Yq1d9t9zLAwQZdZBf2fMFu3TLiK.', role: 'Consultant', groupName: 'General', refreshToken: 'token6' },
      { username: 'felician', email: 'felicia.naicker@gmail.com', password: '$2b$10$qEFzlaFITShqbaOG4CXFwuXFgjIx6zNx.xDoNlNaFyG.623Mf1Wom', role: 'Project Manager', groupName: 'General', refreshToken: 'token7' },
      { username: 'siwam', email: 'siwa.mautusa@gmail.com', password: '$2b$10$KMfmqzsWMEw9hzo8bLWccuhbNgoF8XkOFkX8H1c0t3ByOOnNZwi2i', role: 'Project Manager', groupName: 'General', refreshToken: 'token8' }
    ];

    for (const user of users) {
      await User.create(user);
    }

    console.log('Users created.');

    // Create sample projects
    const projects = [
      {
        name: 'Complete Project 1',
        wbsElement: '6401C30014627.1.7',
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-12-01'),
        duration: 60,
        progress: 40,
        status: 'in_progress',
        projectManagerId: 7, // Felicia Candice Naicker
        directorId: 1 // Zusake Bangani
      },
      {
        name: 'Complete Project 2',
        wbsElement: '6401C30014627.1.8',
        startDate: new Date('2024-11-01'),
        endDate: new Date('2025-01-01'),
        duration: 60,
        progress: 100,
        status: 'completed',
        projectManagerId: 8, // Siwa Langton Mautsa
        directorId: 2 // Vhuhulu Kwinda
      }
    ];

    for (const project of projects) {
      await Project.create(project);
    }

    console.log('Projects created.');

    // Define task code mappings
    const taskCodeMapping = {
      'SAP': { taskId: 'App-01', description: 'SAP application (SAP ECC, SAP4 Hana, GRC, SM, etc)' },
      'Oracle': { taskId: 'App-03', description: 'Oracle EBS' },
      'Microsoft SQL': { taskId: 'DB-01', description: 'Microsoft SQL database' },
      'REVIEW': { taskId: 'M-01', description: 'Review task' },
      'Project Management': { taskId: 'M-02', description: 'Project management task' }
    };

    // Create tasks for Project 1
    const tasksProject1 = [
      { taskName: 'SAP', hours: 2.0, actualHours: 1.5, start_date: new Date('2024-10-01'), due_date: new Date('2024-12-01'), status: 'completed', assigned_to_user_id: 3, projectId: 1 },
      { taskName: 'SAP', hours: 8.0, actualHours: 6.5, start_date: new Date('2024-10-02'), due_date: new Date('2024-12-01'), status: 'in_progress', assigned_to_user_id: 4, projectId: 1 },
      { taskName: 'Oracle', hours: 2.0, actualHours: 2.0, start_date: new Date('2024-10-03'), due_date: new Date('2024-12-01'), status: 'completed', assigned_to_user_id: 5, projectId: 1 },
      { taskName: 'Microsoft SQL', hours: 1.0, actualHours: 1.0, start_date: new Date('2024-10-04'), due_date: new Date('2024-12-01'), status: 'in_progress', assigned_to_user_id: 5, projectId: 1 },
      { taskName: 'REVIEW', hours: 5.0, actualHours: 4.0, start_date: new Date('2024-10-05'), due_date: new Date('2024-12-01'), status: 'completed', assigned_to_user_id: 6, projectId: 1 }
    ];

    for (const task of tasksProject1) {
      const { taskId, description } = taskCodeMapping[task.taskName];
      await Task.create({
        taskId,
        taskName: task.taskName,
        description,
        hours: task.hours, // Correctly reference task.hours
        actualHours: task.actualHours,
        start_date: task.start_date, // Correctly map start_date
        due_date: task.due_date, // Correctly map due_date
        status: task.status,
        assigned_to_user_id: task.assigned_to_user_id,
        projectId: task.projectId
      });
    }

    // Create tasks for Project 2
    const tasksProject2 = [
      { taskName: 'Microsoft SQL', hours: 8.0, actualHours: 8.0, start_date: new Date('2024-11-01'), due_date: new Date('2025-01-01'), status: 'completed', assigned_to_user_id: 6, projectId: 2 },
      { taskName: 'Project Management', hours: 8.0, actualHours: 7.0, start_date: new Date('2024-11-02'), due_date: new Date('2025-01-01'), status: 'in_progress', assigned_to_user_id: 6, projectId: 2 }
    ];

    for (const task of tasksProject2) {
      const { taskId, description } = taskCodeMapping[task.taskName];
      await Task.create({
        taskId,
        taskName: task.taskName,
        description,
        hours: task.hours, // Correctly reference task.hours
        actualHours: task.actualHours,
        start_date: task.start_date, // Correctly map start_date
        due_date: task.due_date, // Correctly map due_date
        status: task.status,
        assigned_to_user_id: task.assigned_to_user_id,
        projectId: task.projectId
      });
    }

    console.log('Tasks created for both projects.');
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    await sequelize.close();
  }
}

seed();
