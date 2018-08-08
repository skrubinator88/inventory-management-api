const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config_env')[env];

//Initializes db and uses config variables to populate verification fields
const db = new Sequelize(config.database.db_name, config.database.username, config.database.password, {
    host: config.database.host,
    dialect: config.database.dialect,
    port: config.database.port,
    //limits Operator Alias use for security reasons
    operatorsAliases: false
});

//Connects db, forces all models to sync to test databases
db.sync({force: false, match: /_test$/})
    .then(() => {
        console.log("Database is successfuly connected");
    })
    .catch((err) => {
        console.log(err);
    });
module.exports = db;
