'use strict';
const { getAllProperties } = require('../Controllers/queries');
module.exports = async function (req, res, next) {
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
    let query = {};
    // if(req.query.rentMin) {
    //     if(parseInt(req.query.rentMin) !== 0) {
    //         query.rentMin = {
    //             ["$or"]: {
    //                 ["$gte"]: parseInt(req.query.rentMin),
    //                 ["$eq"]: 0
    //             }
    //         }
    //     }
    // }
    if(req.query.rentMax) {
        if(parseInt(req.query.rentMax) !== 0) {
            query.rentMin = {
                ["$lte"]: parseInt(req.query.rentMax),
            }
        }
    }
    getAllProperties(infoObject.page, infoObject.pageSize, query, (err, properties) => {
        if(err) {
            return next(err)
        }
        res.status(200).send(properties);
    });
};