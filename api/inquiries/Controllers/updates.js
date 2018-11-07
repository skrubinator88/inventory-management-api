'use strict';

const dbmain = require('../../../config/DB/DBmain');

module.exports = {
    async deleteInquiryLog (id, cb) {
        let InquiryLog = dbmain.model('InquiryLog');
        let Inquiry = dbmain.model('Inquiry');
        try {
            let inquiries = await Inquiry.destroy({
                where: {
                    InquiryLogId: id
                }
            });
            let inquiryLog = await InquiryLog.destroy({
                where: {
                    id: id
                }
            })
            cb(null, true);
        } catch (err) {
            console.error(err);
            cb(err);
        }
    }
};