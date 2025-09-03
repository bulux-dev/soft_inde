import sequelize from 'sequelize';

let db = new sequelize(process.env.DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.HOST,
  dialect: process.env.DB_DIALECT,
  logging: false
});

export default db;