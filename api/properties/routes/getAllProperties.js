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
    if (req.query.queryType) {
        if (req.query.queryType === 'Name') {
            query.propertyName = {
                ["$iLike"]: `%${req.query.search}%`
            }
        } else {
            query.location = true;
            query.query = req.query.search;
        }
    }
    if(req.query.rentMax && req.query.search) {
        query["$and"] = {
            propertyName: {
                ["$iLike"]: `%${req.query.search}%`
            },
            rentMax: {
                ["$lte"]: parseInt(req.query.rentMax)
            }
        };
    } else if (req.query.rentMax){
        query.rentMax = {
            ["$lte"]: parseInt(req.query.rentMax)
        }
    }
    getAllProperties(infoObject.page, infoObject.pageSize, query, (err, properties) => {
        if(err) {
            console.log(err)
            return res.status(500).send({
                error: 'An error occurred on the server while trying to fetch properties'
            });
        }
        res.status(200).send(properties);
    });
};