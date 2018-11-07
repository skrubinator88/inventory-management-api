'use strict';

const dbmain = require('../../../config/DB/DBmain');

module.exports = {
    async createInquiryLog (opts, cb) {
        let InquiryLog = dbmain.model('InquiryLog');
        try {
            let infoObject = {
                    UserId: opts.userId,
                    PropertyId: opts.propertyId,
            };
            console.log(infoObject);
            let inquiryLog = await InquiryLog.create(infoObject);
            return cb(null, inquiryLog);
        } catch (err) {
            console.error(err);
            return cb(err);
        }
    },
    async addInquiry (opts, cb) {
        let InquiryLog = dbmain.model('InquiryLog');
        let Inquiry = dbmain.model('Inquiry');
        try {
            let inquiryLog;
            let infoObject = {};
            if(opts.inquiryLogId) {
                inquiryLog = await InquiryLog.findById(opts.inquiryLogId);
                infoObject.InquiryLogId = inquiryLog.id
            } else {
                inquiryLog = await InquiryLog.findOrCreate({
                    where: {
                        PropertyId:opts.propertyId,
                        UserId: opts.userId
                    }
                });
                infoObject.InquiryLogId = inquiryLog[0].id
            }
            console.log(inquiryLog);
            infoObject.body = opts.message;
            let inquiry = await Inquiry.create(infoObject);
            return cb(null, inquiry)
        } catch (err) {
            console.error(err);
            return cb(err);
        }
    }
};