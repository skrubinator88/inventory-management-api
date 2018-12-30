'use strict';
const { getProperties } = require('../Controllers/queries');
module.exports = async function (req, res, next) {
    let propertyOwnerId = parseInt(req.params.propertyOwnerId);
    if (Number.isNaN(propertyOwnerId)) {
        console.error('property owner id must be a number');
        res.status(400).send({
            error: 'property Owner id must be a number'
        });
        return;
    }
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
    getProperties(propertyOwnerId, infoObject.page, infoObject.pageSize, (err, properties) => {
        if(err) {
            console.error(err);
            return next(err)
        }
        res.status(200).send(properties)
    });
};