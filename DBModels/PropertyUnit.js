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
        propertyUnitName: {
            type: Sequelize.STRING
        },
        bedroomAmount: {
            type: Sequelize.STRING
        },
        bathroomAmount: {
            type: Sequelize.STRING
        },
        rentPrice: {
            type: Sequelize.STRING
        },
        squareFeet: {
            type: Sequelize.STRING
        },
        depositAmount: {
            type: Sequelize.STRING
        },
        availability: {
            type: Sequelize.STRING
        }
    },
    options: {
        freezeTableName: true,
    }
};