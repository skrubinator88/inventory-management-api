'use strict';
const queryController = require('../Controllers/queries');
module.exports = async function (req, res, next) {
    let propertyId = req.params.propertyId;
    if (!(req.query.pageNo || req.query.pageLimit)) {
        res.status(400).send({
            error: 'pageNumber or pageLimit not specified'
        });
        return;
    }
    let pageLimit = parseInt(req.query.pageLimit);
    let pageNumber = (parseInt(req.query.pageNo) - 1) * pageLimit;
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
    await queryController.getPropertyUnits(propertyId, infoObject.page, infoObject.pageSize, (err, units) => {
        if(err) {
            return next(err);
        }
        res.status(200).send(units);
    })
};