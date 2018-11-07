"use strict";
const queryController = require('../Controllers/queries');
//route used for retrieving a specific user
module.exports = async function (req, res, next) {
    let propertyId = req.params.propertyId;
    await queryController.getPropertyById(propertyId, (err, property) => {
        if(err) {
            return next(err)
        }
        res.status(200).send(property)
    })
};