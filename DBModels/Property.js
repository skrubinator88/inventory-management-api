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
        propertyName: {
            type: Sequelize.STRING
        },
        propertyPhoneNumber: {
            type: Sequelize.STRING
        },
        propertyEmail: {
            type: Sequelize.STRING
        },
        propertyWebsite: {
            type: Sequelize.STRING
        },
        applicationFee: {
            type: Sequelize.DOUBLE
        }
    },
    options: {
        freezeTableName: true,
        }
};