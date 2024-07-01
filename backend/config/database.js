const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dpms_serv', '2eusake', 'buttermilkjesus', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('Database connected son...'))
  .catch(err => console.log('Error: ' + err));

module.exports = sequelize;
