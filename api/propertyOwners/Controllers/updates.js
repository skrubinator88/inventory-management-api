'use strict';

const dbmain = require('../../../config/DB/DBmain');

module.exports = {
    async updatePropertyOwnerAdmin (id, stripeId, cb) {
        let Admin = dbmain.model('PropertyOwnerAdmin');
        try {
            Admin.update(
            { stripeAccountId: stripeId},
            { returning: true, where: { id: id } }
            ).then(function([rowsUpdated, [accountUpdated]]) {
                return cb(null, accountUpdated)
            }).catch(err => {
                return cb(err);
            })
        } catch (err) {
            console.error(err);
            return cb(err);
        }
    }
};