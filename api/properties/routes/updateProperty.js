'use strict';
const { updatePropertyById } = require('../Controllers/updates');
module.exports = async function (req, res, next) {
    let propertyId = req.params.propertyId;
    let updatedInfo = {};
    if (req.body.name) { updatedInfo.name = req.body.name; }
    if (req.body.applicationFee) { updatedInfo.applicationFee = parseFloat(req.body.applicationFee); }
    try {
        updatePropertyById(propertyId, updatedInfo, function(err, updated) {
            if(err)
                return next(err)
            if(!updated)
                return res.status(401).send({
                    error: 'Property could not be updated'
                });
            res.status(200).send({
                info: 'property updated'
            })
        })
    } catch (err) {
        res.status(500).send({
            error: 'An error occurred trying to update property'
        })
    }
};