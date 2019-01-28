"use strict";
const { createUserCharge } = require('../Controllers/updates');

module.exports = async function (req, res, next) {
    if(!req.params.propertyId) {
        return res.status(400).send({
            error: 'Please provide a property Id'
        });
    }
    let infoObject = {
        userId: req.userId,
        propertyId: req.params.propertyId
    };
    createUserCharge(infoObject, function(err, charged) {
        if(err)
            return next(err);
        if(!charged) {
            return res.status(500).send({
                error: 'An error occurred while trying to charge customer'
            })
        }
        return res.status(200).send(charged)
    })
};