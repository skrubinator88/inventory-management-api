'use strict';
const dbmain = require('../../../config/DB/DBmain');
const bcrypt = require('bcrypt');


module.exports = {
    async validatePassword(user, password) {
        let match;
        try {
            console.log("Validating password...");
            match = await bcrypt.compare(password, user.passwordHash);
        } catch(err) {
            return next(err)
        }
        return match
    }
};