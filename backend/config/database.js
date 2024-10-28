const { Sequelize } = require("sequelize");
const fs = require("fs");

//KPiu7qTJnGs51CGDX7ab

const sequelize = new Sequelize(
  process.env.DB_NAME,       
  process.env.DB_USER,       
  process.env.DB_PASS,       
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    port: process.env.DB_PORT || 3306, 
    dialectOptions: {
      ssl: {
        
        ca: fs.readFileSync(path.join(__dirname, "eu-north-1-bundle.pem")),
      },
    },
    logging: false, 
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Database connected son..."))
  .catch((err) => console.log("Error: " + err));

module.exports = sequelize;


