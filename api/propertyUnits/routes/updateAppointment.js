'use strict';
const updateController = require('../Controllers/updates');
module.exports = async function (req, res) {
    let propertyUnitId = req.params.propertyUnitId;
    let updatedInfo = {};
    if (req.body.status) { updatedInfo.status = req.body.status; }
    if(req.body.description) { updatedInfo.description = req.body.description }
    try {
        let update = await updateController.updatePropertyUnitById(propertyUnitId, updatedInfo);
        res.status(200).send(update)
    } catch (err) {
        res.status(500).send({
            error: 'An error occurred trying to update barbershop'
        })
    }
};