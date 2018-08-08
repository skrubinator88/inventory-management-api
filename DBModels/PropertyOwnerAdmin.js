'use strict';
const dbmain = require('../config/DB/DBmain');
const Sequelize = dbmain.Seq();
const bcrypt = require('bcrypt');
const saltRounds = 5;

module.exports = {
    model: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        paymentInfo: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null
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