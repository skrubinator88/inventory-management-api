'use strict';
const dbmain = require('../config/DB/DBmain');
const Sequelize = dbmain.Seq();
const bcrypt = require('bcrypt');
const saltRounds = 5;
const uuidv4 = require('uuid/v4');

module.exports = {
    model: {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            default: uuidv4()
        },
        propertyName: Sequelize.STRING,
        propertyPhoneNumber: Sequelize.STRING,
        propertyEmail: Sequelize.STRING,
        propertyWebsite: Sequelize.STRING,
        applicationFee: Sequelize.DOUBLE,
        rentMin: Sequelize.INTEGER,
        rentMax: Sequelize.INTEGER
    },
    options: {
        freezeTableName: true,
        }
};