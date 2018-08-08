'use strict';
const dbmain = require('../config/DB/DBmain');
const Sequelize = dbmain.Seq();

module.exports = {
    model: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        body: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
    options: {
        freezeTableName: true,
    }
};