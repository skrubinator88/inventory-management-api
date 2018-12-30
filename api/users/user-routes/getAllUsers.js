'use strict';
const { getAllUsers } = require('../Controllers/queries');
module.exports = async function (req, res, next) {
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
        query: {}
    };
    if (req.query.queryType) {
        if (req.query.queryType === 'Email') {
            infoObject.query.email = {
                ["$iLike"]: `%${req.query.search}%`
            }
        } else {
            infoObject.query['$or'] = {
                firstName : {
                    ["$iLike"]: `%${req.query.search}%`
                },
                lastName : {
                    ["$iLike"]: `%${req.query.search}%`
                }
            }

        }
    }
    getAllUsers(infoObject, function(err, users) {
        if(err)
            return next(err);
        return res.status(200).send(users);
    });
};