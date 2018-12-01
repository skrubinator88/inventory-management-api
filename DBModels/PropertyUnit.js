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
        propertyUnitName: Sequelize.STRING,
        bedroomAmount: Sequelize.STRING,
        bathroomAmount: Sequelize.STRING,
        rentMin: Sequelize.INTEGER,
        rentMax: Sequelize.INTEGER,
        squareFeet: Sequelize.STRING,
        depositAmount: Sequelize.STRING,
        availability: Sequelize.STRING
    },
    options: {
        freezeTableName: true,
    }
};