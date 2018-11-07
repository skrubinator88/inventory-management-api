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
        email: {
            type: Sequelize.STRING
        },
        phoneNumber: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isPremium: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        premiumExpiryDate: {
            type: Sequelize.DATE,
            defaultValue: Date.now()
        },
        premiumTrialUsed: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    },
    options: {
        freezeTableName: true,
        hooks: {
            beforeCreate: function(model, options) {
                return new Promise((resolve, reject) => {
                    bcrypt.genSalt(saltRounds, (err, salt) => { //generate salt using saltRounds provided
                        if (err) return reject(err);
                        bcrypt.hash(model.password, salt, (err, hash) => { //generate hash using password and salt generated
                            console.log("Getting password encrypted...");
                            model.password = hash;
                            return resolve(model, options)//sets user password to hash
                        });
                    });
                });

            }
        }
    }
};