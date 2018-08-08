"use strict";
const queryController = require('../Controllers/queries');
//route used for retrieving a specific user
module.exports = async function (req, res, next) {
    let propertyId = parseInt(req.params.propertyId);
    if (Number.isNaN(propertyId)) {
        res.status(400).send({
            error: 'property id must be a number'
        });
        return;
    }
    await queryController.getPropertyById(propertyId, (err, property) => {
        if(err) {
            return next(err)
        }
        res.status(200).send(property)
    })
};