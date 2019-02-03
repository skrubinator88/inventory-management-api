'use strict';

const dbmain = require('../../../config/DB/DBmain');
const moment = require('moment');
const Moment = moment();
const { chargePropertyCustomer, createToken } = require('../../Helpers/stripe');

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
        console.log(opts);
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
    },
    async createUserCharge (opts, cb) {
        let Property = dbmain.model('Property');
        let User = dbmain.model('User');
        let PaymentAccount = dbmain.model('PaymentAccount');
        let ApplicationRequest = dbmain.model('ApplicationRequest');
        try {
            let user = await User.findById(opts.userId);
            let property = await Property.findById(opts.propertyId);
            let paymentAccount = (await PaymentAccount.findAll( { where: { PropertyId: property.id } } ))[0];
            if (paymentAccount) {
                let token = await createToken(paymentAccount.stripeAccountId,user.paymentInfo);
                let charge = await chargePropertyCustomer(paymentAccount.stripeAccountId, token.id, property.applicationFee * 100);
                if (charge) {
                    ApplicationRequest.update({ status: 'PROCESSING' }, {returning: true, where: {PropertyId: property.id, UserId: user.id}})
                        .then(function ([rowsUpdated, [propertyUpdated]]) {
                            if (!propertyUpdated)
                                return cb(null, false);
                            return cb(null, {
                                id: propertyUpdated.id,
                                propertyId: propertyUpdated.PropertyId,
                                userId: propertyUpdated.UserId,
                                status: propertyUpdated.status,
                                propertyName: propertyUpdated.propertyName,
                                date: propertyUpdated.createdAt
                            });
                        }).catch(err => { return cb(err) })
                }
                else {
                    return cb(null, false)
                }
            } else {
                return cb(null, false)
            }
        } catch (err) {
            return cb(err)
        }
    },
    async deleteProperty (opts, cb) {
        let Property = dbmain.model('Property');
        try {
            let infoObject = {
                id: opts.id
            };
            console.log(infoObject);
            Property.update({ status: 'DELETED' }, {returning: true, where: {id: opts.id}})
                .then(function ([rowsUpdated, [propertyUpdated]]) {
                    if (!propertyUpdated)
                        return cb(null, false);
                    return cb(null, true);
                }).catch(err => { return cb(err) })
            cb(null, true);
        } catch (err) {
            console.error(err);
            cb(err);
        }
    }
};