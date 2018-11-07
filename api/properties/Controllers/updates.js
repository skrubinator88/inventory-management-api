'use strict';

const dbmain = require('../../../config/DB/DBmain');
const moment = require('moment');
const Moment = moment();

module.exports = {
    async startPremiumTrial (id, cb) {
        let Admin = dbmain.model('PropertyAdmin');
        try {
            Admin.update(
                {
                    premiumExpiryDate: Moment.add(30, 'days').calendar(),
                    isPremium: true,
                    premiumTrialUsed: true
                },
                { returning: true, where: { id: id } }
            ).then(function([rowsUpdated, [accountUpdated]]) {
                if(!accountUpdated)
                    return cb(null, false)
                return cb(null, true)
            }).catch(err => {
                return cb(err);
            })
        } catch (err) {
            console.error(err);
            return cb(err);
        }
    },
    async updatePropertyById(propertyId, opts, cb) {
        let Property = dbmain.model('Property');
        try {
            Property.update(opts, { returning: true, where: { id: propertyId } })
                .then(function([rowsUpdated, [ propertyUpdated ]]) {
                    if(!propertyUpdated)
                        return cb(null, false);
                    return cb(null, true);
                })
        } catch (err) {
            console.log(err);
            return cb(err);
        }
    }
};