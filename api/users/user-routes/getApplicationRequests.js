'use strict';
const { getApplicationRequests } = require('../Controllers/queries');
module.exports = async function (req, res, next) {
    let userId = req.params.userId;

    getApplicationRequests(userId, (err, applicationRequests) => {
        if(err) {
            return next(err);
        }
        res.status(200).send(applicationRequests);
    })
};