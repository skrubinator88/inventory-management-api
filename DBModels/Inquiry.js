'use strict';
const dbmain = require('../config/DB/DBmain');
const Sequelize = dbmain.Seq();
const uuidv4 = require('uuid/v4');

module.exports = {
    model: {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            default: uuidv4()
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