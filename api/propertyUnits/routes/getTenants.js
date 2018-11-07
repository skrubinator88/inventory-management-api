'use strict';
const queryController = require('../Controllers/queries');
module.exports = async function (req, res, next) {
    let propertyOwnerId = req.params.propertyOwnerId;
    if (!(req.query.pageNo || req.query.pageLimit)) {
        console.error('pageNo or pageLimit not specified');
        res.status(400).send({
            error: 'pageNumber or pageLimit not specified'
        });
        return;
    }
    let pageLimit = parseInt(req.query.pageLimit);
    let pageNumber = (parseInt(req.query.pageNo) - 1) * pageLimit;
    if (Number.isNaN(pageNumber) || Number.isNaN(pageLimit)) {
        console.error('pageNo or pageLimit are not valid entries');
        res.status(400).send({
            error: 'pageNumber and pageLimit must both be numbers'
        });
        return;
    }
    let infoObject = {
        page: pageNumber,
        pageSize: pageLimit
    };
    let query = {};
    if(req.query.status) {
        if(req.query.status === 'pending') {
            query.status = 'PENDING';
        } else if (req.query.status === 'confirmed') {
            query.status = 'CONFIRMED'
        }
    }
    queryController.getInvoices(propertyOwnerId, infoObject.page, infoObject.pageSize, query, (err, invoices) => {
        if(err) {
            console.error(err);
            return next(err)
        }
        res.status(200).send(invoices)
    });
};