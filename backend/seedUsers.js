const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const users = [
  { username: 'Alice Johnson', email: 'alice.johnson@example.com', password: 'password123', role: 'consultant' },
  { username: 'Bob Smith', email: 'bob.smith@example.com', password: 'password123', role: 'projectManager' },
  { username: 'Carol White', email: 'carol.white@example.com', password: 'password123', role: 'director' },
  { username: 'David Brown', email: 'david.brown@example.com', password: 'password123', role: 'consultant' },
  { username: 'Emma Davis', email: 'emma.davis@example.com', password: 'password123', role: 'projectManager' },
  { username: 'Frank Wilson', email: 'frank.wilson@example.com', password: 'password123', role: 'director' },
  { username: 'Grace Taylor', email: 'grace.taylor@example.com', password: 'password123', role: 'consultant' },
  { username: 'Henry Miller', email: 'henry.miller@example.com', password: 'password123', role: 'projectManager' },
  { username: 'Ivy Anderson', email: 'ivy.anderson@example.com', password: 'password123', role: 'director' },
  { username: 'Jack Harris', email: 'jack.harris@example.com', password: 'password123', role: 'consultant' },
  { username: 'Kara Lewis', email: 'kara.lewis@example.com', password: 'password123', role: 'projectManager' },
  { username: 'Liam Clark', email: 'liam.clark@example.com', password: 'password123', role: 'director' },
];

async function hashPasswords(users) {
  const saltRounds = 10;
  for (let user of users) {
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
  return users;
}

async function seedUsers() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: '2eusake',
    password: 'buttermilkjesus', 
    database: 'dpms_serv'  
  });
  
  const hashedUsers = await hashPasswords(users);

  for (const user of hashedUsers) {
    const { username, email, password, role } = user;
    const sql = `
      INSERT INTO users (username, email, password, role, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        username = VALUES(username),
        password = VALUES(password),
        role = VALUES(role),
        updatedAt = VALUES(updatedAt)
    `;
    const values = [username, email, password, role, new Date(), new Date()];
    await connection.query(sql, values);
  }

  await connection.end();
}

seedUsers().then(() => console.log('Users seeded successfully')).catch(console.error);
