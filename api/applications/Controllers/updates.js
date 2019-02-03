'use strict';

const dbmain = require('../../../config/DB/DBmain');
// const { sendNotification } = require('../../../config/apnManager');

module.exports = {
    async deleteApplication (applicationId, cb) {
        let Application = dbmain.model('ApplicationRequest');
        try {
            await Application.destroy({
                where: {
                    id: applicationId
                }
            });
            cb(null, true);
        } catch (err) {
            console.error(err);
            cb(err);
        }
    },
    async updateApplication (opts, id, cb) {
        let Application = dbmain.model('ApplicationRequest');
        try {
            Application.update(
               opts, { returning: true, where: { id: id } }
            ).then(function([rowsUpdated, [accountUpdated]]) {
                if(!accountUpdated)
                    return cb(null, false);
                return cb(null, true)
            })
        } catch (err) {
            console.error(err);
            cb(err);
        }
    }
};