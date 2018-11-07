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
        streetAddress: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING
        },
        state: {
            type: Sequelize.STRING
        },
        zipCode: {
            type: Sequelize.STRING
        },
        country: {
            type: Sequelize.STRING,
            allowNull: true
        },
        latitude: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        longitude: {
            type: Sequelize.FLOAT,
            allowNull: true
        }
    },
    relations: {
    },
    options: {
        freezeTableName: true
    }
};