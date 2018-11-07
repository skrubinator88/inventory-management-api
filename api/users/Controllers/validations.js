'use strict';
const dbmain = require('../../../config/DB/DBmain');
const bcrypt = require('bcrypt');


module.exports = {
    async validatePassword(user, password, cb) {
        let match;
        try {
            console.log("Validating password...");
            match = await bcrypt.compare(password, user.password);
            cb(null, match)
        } catch(err) {
            cb(err)
        }
    }
};