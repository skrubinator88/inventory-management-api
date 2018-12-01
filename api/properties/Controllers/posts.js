'use strict';

const dbmain = require('../../../config/DB/DBmain');
const uuidv4 = require('uuid/v4');
const mailer = require('../../Helpers/mailManager/mail');

module.exports = {
    async addPaymentAccount (id, stripeId, cb) {
        let PaymentAccount = dbmain.model('PaymentAccount');
        try {
            let infoObject = {
                id: uuidv4(),
                PropertyId: id,
                stripeAccountId: stripeId
            };
            console.log(infoObject);
            let account = await PaymentAccount.findOrCreate({ where: infoObject });
           cb(null, account);
        } catch (err) {
            console.error(err);
            cb(err);
        }
    },
    async createApplicationRequest (opts, cb) {
        let ApplicationRequest = dbmain.model('ApplicationRequest');
        let Property = dbmain.model('Property');
        try {
            ApplicationRequest.findOrCreate(
                {
                    where: { UserId: opts.userId, PropertyId: opts.propertyId },
                    defaults: {
                        id: uuidv4(),
                        creditScore: opts.creditScore,
                        budget: opts.budget,
                        location: opts.location,
                        status: opts.status || 'PENDING'
                    }
                })
                .spread(async (applicationRequest, created) => {
                    if(created) {
                        let property = await Property.findById(opts.propertyId);
                        let appRequest = {
                            id: applicationRequest.id,
                            propertyId: applicationRequest.PropertyId,
                            userId: applicationRequest.UserId,
                            status: applicationRequest.status,
                            propertyName: property.propertyName
                        };
                        return cb(null, appRequest);
                    }
                    return cb(null, false)
                })
        } catch (err) {
            return cb(err)
        }
    },
    async sendSupportEmail(userId, cb) {

    }
};