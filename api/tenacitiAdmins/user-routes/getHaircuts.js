'use strict';
const queryController = require('../Controllers/queries');
module.exports = async function (req, res) {
    if (!(req.params.userId)) {
        res.status(400).send({
            error: 'You must provide a user id'
        });
        return;
    }
    let userId = parseInt(req.params.userId);
    if (Number.isNaN(userId)) {
        res.status(400).send({
            error: 'user id must be a number'
        });
        return;
    }
    if (!(req.query.pageNo || req.query.pageLimit)) {
        res.status(400).send({
            error: 'pageNumber or pageLimit not specified'
        });
        return;
    }
    let pageLimit = parseInt(req.query.pageLimit);
    let pageNumber = (parseInt(req.query.pageNumber) - 1) * pageLimit;
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
    try {
        let haircuts = await queryController.getHaircuts(userId, infoObject.page, infoObject.pageSize);
        res.status(200).send(haircuts);
    } catch (err) {
        res.status(500).send({
            error: 'An error occurred trying to retrieve haircuts'
        });
    }
};