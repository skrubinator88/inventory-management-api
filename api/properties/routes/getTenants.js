'use strict';
const queryController = require('../Controllers/queries');
module.exports = async function (req, res, next) {
    let propertyId = req.params.propertyId;
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
        pageSize: pageLimit,
        query: {
            PropertyId: propertyId
        }
    };
    if (req.query.queryType) {
        if (req.query.queryType === 'Email') {
                infoObject.query.email = {
                    ["$like"]: req.query.search
                }
        } else {
            infoObject.query['$or'] = {
                firstName : {
                    ["$like"]: req.query.search
                },
                lastName : {
                    ["$like"]: req.query.search
                }
            }

        }
    }
    console.log(infoObject);
    // let query = {
    //     PropertyId: propertyId
    // };
    await queryController.getTenants(infoObject, (err, tenants) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.status(200).send(tenants);
    });
};