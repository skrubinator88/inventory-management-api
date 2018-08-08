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
        ImgUrl: {
            type: Sequelize.STRING
        }
    },
    options: {
        freezeTableName: true,
        }
};