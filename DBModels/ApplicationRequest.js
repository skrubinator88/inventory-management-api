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
        status: {
            type: Sequelize.STRING,
            defaultValue: 'PENDING'
        },
        creditScore: Sequelize.STRING,
        budget: Sequelize.STRING,
        location: Sequelize.STRING,
        description: Sequelize.STRING
    },
    options: {
        freezeTableName: true,
    }
};