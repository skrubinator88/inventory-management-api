'use strict';
const dbmain = require('../config/DB/DBmain');
const Sequelize = dbmain.Seq();

module.exports = {
    model: {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            default: Sequelize.fn('uuid_generate_v4')
        }
    },
    options: {
        freezeTableName: true,
    }
};