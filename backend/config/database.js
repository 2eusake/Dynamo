const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('IV', 'root', 'Yandisa5!142914', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected son..."))
  .catch((err) => console.log("Error: " + err));

module.exports = sequelize;
