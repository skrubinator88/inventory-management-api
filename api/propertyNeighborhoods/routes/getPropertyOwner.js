"use strict";
const queryController = require('../Controllers/queries');
//route used for retrieving a specific user
module.exports = async function (req, res) {
    let propertyOwnerId = parseInt(req.params.propertyOwnerId);
    if (Number.isNaN(propertyOwnerId)) {
        res.status(400).send({
            error: 'property owner id must be a number'
        });
        return;
    }
    await queryController.getPropertyOwnerAdminById(propertyOwnerId, function(err, propertyAdmin) {
        if(err) {
            return res.status(500).send({
                error: 'An error occurred trying to retrieve property admin'
            })
        } else {
            res.status(200).send(propertyAdmin)
        }
    })
};