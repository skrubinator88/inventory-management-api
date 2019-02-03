'use strict';
const { updateApplication } = require('../Controllers/updates');

module.exports = async function (req, res, next) {
    let applicationId = req.params.applicationId;
    let updatedInfo = {};
    if (req.body.status) { updatedInfo.status = req.body.status; }
    if(req.body.description) { updatedInfo.description = req.body.description }
    updateApplication(updatedInfo, applicationId, function(err, completed) {
        if(err) {
            return next(err)
        }
        res.status(200).send(completed)
    });
};