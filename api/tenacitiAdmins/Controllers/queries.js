'use strict';
const dbmain = require('../../../config/DB/DBmain');

module.exports = {
    async getAdmin (id, cb) {
        let TenacitiAdmin = dbmain.model('TenacitiAdmin');
        try {
            let admin = await TenacitiAdmin.findById(id);
            cb(null, {
                adminId: admin.id,
                adminUsername: admin.username
            });
        } catch (err) {
            console.error(err);
            return cb(err);
        }
    }
};