const { Sequelize } = require("sequelize");
const fs = require("fs");

//KPiu7qTJnGs51CGDX7ab

const sequelize = new Sequelize('dpms_serv', 'zeusake', 'KPiu7qTJnGs51CGDX7ab', {
  host: 'dynamo.c324ec2065m6.eu-north-1.rds.amazonaws.com',
  dialect: 'mysql',
  port: 5000,
  dialectOptions: {
    ssl: {
      ca: fs.readFileSync('C:/Users/mbtlut003/Documents/Code week 2/DPMS-P/backend/config/eu-north-1-bundle.pem') 
    }
  }}
);

sequelize
  .authenticate()
  .then(() => console.log("Database connected son..."))
  .catch((err) => console.log("Error: " + err));

module.exports = sequelize;
