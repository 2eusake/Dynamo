const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("VEE", "root", "khotsimunene03", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected son..."))
  .catch((err) => console.log("Error: " + err));

module.exports = sequelize;
