'use strict';
const dbmain = require('../../../config/DB/DBmain');

module.exports = {
    async getInvoices (id, page, limit) {
        let options = {
            where: { TenacitiAdminId: id },
            limit: limit,
            offset: page
        };
        let Invoice = dbmain.model('Invoice');
        try {
            let response = [];
            let invoices = await Invoice.findAll(options);
            invoices.map(async invoice => {
                let obj = {};
                obj.id = invoice.id;
                obj.file = invoice.filePath;
                response.push(obj);
            });
            return response;
        } catch (err) {
            console.error(err);
        }
    }
};