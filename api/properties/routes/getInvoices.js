'use strict';
const queryController = require('../Controllers/queries');
module.exports = async function (req, res, next) {
    let propertyId = parseInt(req.params.propertyId);
    if (Number.isNaN(propertyId)) {
        res.status(400).send({
            error: 'barber id must be a number'
        });
        return;
    }
    if (!(req.query.pageNo || req.query.pageLimit)) {
        res.status(400).send({
            error: 'pageNumber or pageLimit not specified'
        });
        return;
    }
    let pageLimit = parseInt(req.query.pageLimit);
    let pageNumber = (parseInt(req.query.pageNumber) - 1) * pageLimit;
    if (Number.isNaN(pageNumber) || Number.isNaN(pageLimit)) {
        res.status(400).send({
            error: 'pageNumber and pageLimit must both be numbers'
        });
        return;
    }
    let infoObject = {
        page: pageNumber,
        pageSize: pageLimit
    };
    await queryController.getInvoices(propertyId, infoObject.page, infoObject.pageSize, (err, invoices) => {
        if(err) {
            console.error(err);
            return next(err);
        }
        res.status(200).send(invoices);
    });
};