const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const fs = require('fs');

// Define users with specific IDs
const users = [
  { id: 1, username: 'Alice Johnson', email: 'alice.johnson@example.com', password: 'password123', role: 'consultant' },
  { id: 2, username: 'Bob Smith', email: 'bob.smith@example.com', password: 'password123', role: 'projectManager' },
  { id: 3, username: 'Carol White', email: 'carol.white@example.com', password: 'password123', role: 'director' },
  { id: 4, username: 'David Brown', email: 'david.brown@example.com', password: 'password123', role: 'consultant' },
  { id: 5, username: 'Emma Davis', email: 'emma.davis@example.com', password: 'password123', role: 'projectManager' },
  { id: 6, username: 'Frank Wilson', email: 'frank.wilson@example.com', password: 'password123', role: 'director' },
  { id: 7, username: 'Grace Taylor', email: 'grace.taylor@example.com', password: 'password123', role: 'consultant' },
  { id: 8, username: 'Henry Miller', email: 'henry.miller@example.com', password: 'password123', role: 'projectManager' },
  { id: 9, username: 'Ivy Anderson', email: 'ivy.anderson@example.com', password: 'password123', role: 'director' },
  { id: 10, username: 'Jack Harris', email: 'jack.harris@example.com', password: 'password123', role: 'consultant' },
  { id: 11, username: 'Kara Lewis', email: 'kara.lewis@example.com', password: 'password123', role: 'projectManager' },
  { id: 12, username: 'Liam Clark', email: 'liam.clark@example.com', password: 'password123', role: 'director' },
];

// Define projects and tasks
const projects = [
  { id: 1, name: 'Project Alpha', description: 'Alpha project description', startDate: '2024-09-01', endDate: '2024-12-01', status: 'active', projectManagerId: 2 },
  { id: 2, name: 'Project Beta', description: 'Beta project description', startDate: '2024-09-15', endDate: '2024-11-15', status: 'active', projectManagerId: 5 },
];

const tasks = [
  { name: 'Task 1', description: 'Description for Task 1', due_date: '2024-10-01', assigned_to_user_id: 1, project_id: 1 },
  { name: 'Task 2', description: 'Description for Task 2', due_date: '2024-10-15', assigned_to_user_id: 4, project_id: 1 },
  { name: 'Task 3', description: 'Description for Task 3', due_date: '2024-11-01', assigned_to_user_id: 7, project_id: 2 },
  { name: 'Task 4', description: 'Description for Task 4', due_date: '2024-11-15', assigned_to_user_id: 10, project_id: 2 },
];

async function hashPasswords(users) {
  const saltRounds = 10;
  for (let user of users) {
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
  return users;
}

async function seedData() {
  let pool;
  try {
    pool = mysql.createPool({
      host: 'dynamo.c324ec2065m6.eu-north-1.rds.amazonaws.com',
      user: 'zeusake',
      password: 'KPiu7qTJnGs51CGDX7ab',  
      database: 'dpms_serv',
      ssl: {
        ca: fs.readFileSync('./config/eu-north-1-bundle.pem')
      },
      connectTimeout: 120000, // Increased to 2 minutes
      connectionLimit: 10 // Using a connection pool
    });

    console.log('Connected successfully!');

    // Seed users
    const hashedUsers = await hashPasswords(users);
    for (const user of hashedUsers) {
      const { id, username, email, password, role } = user;
      const sql = `
        INSERT INTO users (id, username, email, password, role, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          username = VALUES(username),
          email = VALUES(email),
          password = VALUES(password),
          role = VALUES(role),
          updatedAt = VALUES(updatedAt)
      `;
      const values = [id, username, email, password, role, new Date(), new Date()];
      await pool.query(sql, values);
    }

    // Seed projects
    for (const project of projects) {
      const { id, name, description, startDate, endDate, status, projectManagerId } = project;
      const sql = `
        INSERT INTO projects (id, name, description, startDate, endDate, status, projectManagerId, userId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          description = VALUES(description),
          startDate = VALUES(startDate),
          endDate = VALUES(endDate),
          status = VALUES(status),
          projectManagerId = VALUES(projectManagerId),
          updatedAt = VALUES(updatedAt)
      `;
      const values = [id, name, description, startDate, endDate, status, projectManagerId, projectManagerId, new Date(), new Date()];
      await pool.query(sql, values);
    }

    // Seed tasks
    for (const task of tasks) {
      const { name, description, due_date, assigned_to_user_id, project_id } = task;
      const sql = `
        INSERT INTO tasks (name, description, due_date, assigned_to_user_id, project_id, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [name, description, due_date, assigned_to_user_id, project_id, new Date(), new Date()];
      await pool.query(sql, values);
    }

    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    if (error.code === 'ETIMEDOUT') {
      console.error('Connection timed out. Please check your network connection and RDS security group settings.');
    }
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

// Usage
seedData().catch(console.error);