'use strict';
const { getApplications } = require('../Controllers/queries');
module.exports = async function (req, res, next) {

    if(!req.params.propertyId) {
        return res.status(400).send({
            error: 'Property Id required'
        })
    }
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
    let query = { PropertyId: req.params.propertyId };
    getApplications(query, infoObject.pageSize, infoObject.page, (err, properties) => {
        if(err) {
            return res.status(500).send({
                error: 'An error occurred on the server while trying to fetch applications'
            });
        }
        res.status(200).send(properties);
    });
};