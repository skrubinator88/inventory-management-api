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
        name: {
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