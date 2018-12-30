'use strict';
const { getPropertyUnits } = require('../Controllers/queries');
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
    let query = { PropertyId: propertyId };
    let include = [];
    if(parseInt(req.query.rentMin) > 6000) {
        if(parseInt(req.query.rentMin) !== 0) {
            query.rentMin = {
                ["$or"]: {
                    ["$gte"]: parseInt(req.query.rentMin),
                    ["$eq"]: 0
                }
            }
        }
    }
    if(req.query.includeAppointments) {
        if(req.query.includeAppointments === "true") {
           include = true
        }
    } else {
        include = false
    }
    console.log(include);
    if(req.query.rentMax) {
        if(parseInt(req.query.rentMax) !== 0) {
            query.rentMax = {
                ["$lte"]: parseInt(req.query.rentMax)
            }
        }
    }
    getPropertyUnits(query, include, infoObject.page, infoObject.pageSize, (err, units) => {
        if(err) {
            console.log(err);
            return res.status(500).send({
                error: 'An error occurred on the server while trying to fetch units'
            });
        }
        res.status(200).send(units);
    })
};