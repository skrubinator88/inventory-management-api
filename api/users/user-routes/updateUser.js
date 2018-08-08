'use strict';
const updateController = require('../Controllers/updates');
module.exports = async function (req, res) {
    let userId = parseInt(req.params.userId);
    if (Number.isNaN(userId)) {
        res.status(400).send({
            error: 'user id must be a number'
        });
        return;
    }
    let updatedInfo = {};
    if (req.body.paymentInfo) { updatedInfo.paymentInfo = req.body.paymentInfo; }
    if (req.body.email) { updatedInfo.email = req.body.email; }
    if (req.body.password) { updatedInfo.passwordHash = req.body.password; }
    if (req.body.gender) { updatedInfo.gender = req.body.gender; }
    if (req.body.phoneNumber) { updatedInfo.phoneNumber = req.body.phoneNumber; }
    try {
        let update = await updateController.updateUserById(userId, updatedInfo);
        res.status(200).send(update)
    } catch (err) {
        res.status(500).send({
            error: 'An error occurred trying to update user'
        })
    }
};