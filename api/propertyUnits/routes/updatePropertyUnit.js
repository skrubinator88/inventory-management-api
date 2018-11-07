'use strict';
const updateController = require('../Controllers/updates');
module.exports = async function (req, res) {
    let propertyUnitId = req.params.propertyUnitId;
    let updatedInfo = {};
    if (req.body.paymentInfo) { updatedInfo.paymentInfo = req.body.paymentInfo; }
    if (req.body.username) { updatedInfo.username = req.body.username; }
    if (req.body.password) { updatedInfo.passwordHash = req.body.password; }
    try {
        let update = await updateController.updatePropertyUnitById(propertyUnitId, updatedInfo);
        res.status(200).send(update)
    } catch (err) {
        res.status(500).send({
            error: 'An error occurred trying to update barbershop'
        })
    }
};