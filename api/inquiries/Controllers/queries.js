'use strict';

const dbmain = require('../../../config/DB/DBmain');

module.exports = {
    async getAllInquiryLogs (options, cb) {
        let InquiryLog = dbmain.model('InquiryLog');

        let query = {
            where: options.query || {},
            limit: options.pageLimit,
            offset: options.page
        };
        try {
            let response = [];
            let inquiryLogs = await InquiryLog.findAll(query);
            inquiryLogs.map(async inquiryLog => {
                let obj = {};
                obj.lastUpdated = inquiryLog.updatedAt;
                obj.createdAt = inquiryLog.createdAt;
                obj.user = inquiryLog.UserId;
                obj.property = inquiryLog.PropertyId;
                response.push(obj);
            });
            return response;
        } catch(err) {
            console.error(err);
        }
    },
    async getInquiryLogById (id, cb) {
        let InquiryLog = dbmain.model('InquiryLog');
        let Inquiry = dbmain.model('Inquiry');
        let User = dbmain.model('User');
        let Property = dbmain.model('Property');

        try {
            let response = {};
            response.inquiries = [];
            let inquiryLog = await InquiryLog.findById(id);
            let user = await User.findById(inquiryLog.UserId);
            let property = await Property.findById(inquiryLog.PropertyId);

            let inquiries = await Inquiry.findAll({
                where: {
                    PropertyId: inquiryLog.PropertyId,
                    UserId: inquiryLog.UserId
                },
                order: [
                    ['createdAt', 'DESC']
                ]
            });
            inquiries.map(async inquiry => {

                let obj = {};
                obj.createdAt = inquiry.createdAt;
                obj.message = inquiry.body;
                response["inquires"].push(obj);
            })
            response.userId = user.id;
            response.userName = user.name;
            response.propertyId = property.id;
            response.propertyName = property.propertyName;
            return cb(null, response);
        } catch(err) {
           console.error(err)
            return cb(err)
        }
    }
};