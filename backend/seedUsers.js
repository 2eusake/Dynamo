const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const fs = require('fs');

// Database connection configuration
const dbConfig = {
  host: 'dynamo.c324ec2065m6.eu-north-1.rds.amazonaws.com',
  user: 'zeusake',
  password: 'KPiu7qTJnGs51CGDX7ab',
  database: 'dpms_serv',
  port: 5000,
  ssl: {
    ca: fs.readFileSync('C:/Users/Zusakhe/OneDrive - University of Cape Town/Desktop/DPMS-P/backend/config/eu-north-1-bundle.pem')
  }
};

// Users to seed
const users = [
  { username: 'Zusake Bangani', email: 'bngzus001@myuct.ac.za', password: 'password123', role: 'Director' },
  { username: 'Vhuhulu Kwinda', email: 'kwindavee@gmail.com', password: 'password123', role: 'Director' },
  { username: 'Nicole Kudzaishe Matiyenga', email: 'nicole@gmail.com', password: 'password123', role: 'Consultant' },
  { username: 'Andile Felicia Msibi', email: 'andile@gmail.com', password: 'password123', role: 'Consultant' },
  { username: 'Concetta Ciccone', email: 'concetta@gmail.com', password: 'password123', role: 'Consultant' },
  { username: 'Ruan Ettiene Roux', email: 'ruan@gmail.com', password: 'password123', role: 'Consultant' },
  { username: 'Felicia Candice Naicker', email: 'felicia.naicker@gmail.com', password: 'password123', role: 'Project Manager' },
  { username: 'Siwa Langton Mautsa', email: 'siwa.mautusa@gmail.com', password: 'password123', role: 'Project Manager' }
];

// Hash passwords
async function hashPasswords(users) {
  const saltRounds = 10;
  for (let user of users) {
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
  return users;
}

// Seed users
async function seedUsers() {
  const connection = await mysql.createConnection(dbConfig);

  const hashedUsers = await hashPasswords(users);

  for (const user of hashedUsers) {
    const { username, email, password, role } = user;
    const sql = `
      INSERT INTO Users (username, email, password, role, createdAt, updatedAt)
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
