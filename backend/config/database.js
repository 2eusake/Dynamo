const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('dynamo_database', 'root', 'Lutho2001', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected son..."))
  .catch((err) => console.log("Error: " + err));

module.exports = sequelize;
