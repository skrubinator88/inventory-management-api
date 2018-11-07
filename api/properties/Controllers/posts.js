'use strict';

const dbmain = require('../../../config/DB/DBmain');
const uuidv4 = require('uuid/v4');

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
    }
};