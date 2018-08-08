'use strict';
const updateController = require('../Controllers/updates');
module.exports = async function (req, res) {
    let barbershopId = parseInt(req.params.barbershopId);
    if (Number.isNaN(barbershopId)) {
        res.status(400).send({
            error: 'barbershop id must be a number'
        });
        return;
    }
    let updatedInfo = {};
    if (req.body.paymentInfo) { updatedInfo.paymentInfo = req.body.paymentInfo; }
    if (req.body.username) { updatedInfo.username = req.body.username; }
    if (req.body.password) { updatedInfo.passwordHash = req.body.password; }
    try {
        let update = await updateController.updateBarbershopById(barbershopId, updatedInfo);
        res.status(200).send(update)
    } catch (err) {
        res.status(500).send({
            error: 'An error occurred trying to update barbershop'
        })
    }
};