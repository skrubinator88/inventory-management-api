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
        let users = await queryController.getAllUsers(infoObject.page, infoObject.pageSize);
        if (users[0]) {
            res.status(200).send(users);
        }
    } catch(err) {
        res.status(500).send({
            error: 'Error occurred trying to retrieve users: ' + err
        })
    }
};