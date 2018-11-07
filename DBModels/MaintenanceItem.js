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
        date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: "PENDING"
        }
    },
    options: {
        freezeTableName: true,
    }
};