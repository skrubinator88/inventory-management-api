'use strict';
const queryController = require('../Controllers/queries');
module.exports = async function (req, res) {
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
    await queryController.getAllPropertyOwners(infoObject.page, infoObject.pageSize, {}, function(err, propertyOwners) {
        if(err) {
            res.status(500).send({
                error: 'There was an error retrieving Property Owners'
            })
        }
        if (propertyOwners.length > 0) {
            res.status(200).send(propertyOwners);
        } else {
            console.log('no response for some reason');
            res.status(500).send({
                error: 'There was an error retrieving Property Owners'
            })
        }
    })
};