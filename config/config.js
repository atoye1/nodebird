require('dotenv').config();

module.exports = {
  development: {
    username: 'snowdelver',
    password: process.env.SEQUELIZE_PASSWORD,
    database: 'nodebird',
    host: '193.122.108.199',
    dialect: 'mysql',
  },
  production: {
    username: 'snowdelver',
    password: process.env.SEQUELIZE_PASSWORD,
    host: '193.122.108.199d',
    database: 'nodebird',
    dialect: 'mysql',
  },
};
