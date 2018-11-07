'use strict';

const dbmain = require('../../../config/DB/DBmain');

module.exports = {
    async addPropertyOwnerInvoice (id, opts, cb) {
        let PropertyOwner = dbmain.model('PropertyOwner');
        let Invoice = dbmain.model('Invoice');
        try {
            let infoObject = {
                name: opts.name,
                filePath: opts.location,
                PropertyOwnerId: id,
                status: 'CONFIRMED'
            };
            if(opts.propertyId) {
                infoObject.PropertyId = opts.propertyId
            }
            console.log(infoObject);
            await Invoice.create(infoObject);
           cb(null, true);
        } catch (err) {
            console.error(err);
            cb(err);
        }
    }
};