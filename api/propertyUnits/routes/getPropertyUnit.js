"use strict";
const queryController = require('../Controllers/queries');
//route used for retrieving a specific user
module.exports = async function (req, res) {
    let propertyOwnerId = req.params.propertyOwnerId;
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