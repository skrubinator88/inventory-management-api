'use strict';
const queryController = require('../Controllers/queries');
module.exports = async function (req, res, next) {
    let propertyId = parseInt(req.params.propertyId);
    if (Number.isNaN(propertyId)) {
        res.status(400).send({
            error: 'property id must be a number'
        });
        return;
    }
    if (!(req.query.pageNo || req.query.pageLimit)) {
        res.status(400).send({
            error: 'pageNo or pageLimit not specified'
        });
        return;
    }
    let pageLimit = parseInt(req.query.pageLimit);
    let pageNumber = (parseInt(req.query.pageNo) - 1) * pageLimit;
    if (Number.isNaN(pageNumber) || Number.isNaN(pageLimit)) {
        res.status(400).send({
            error: 'pageNo and pageLimit must both be numbers'
        });
        return;
    }
    let infoObject = {
        page: pageNumber,
        pageSize: pageLimit
    };
    let query = {
        PropertyId: propertyId
    };
    await queryController.getTenants(propertyId, infoObject.page, infoObject.pageSize, query, (err, tenants) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.status(200).send(tenants);
    });
};