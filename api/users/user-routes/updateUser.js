'use strict';
const updateController = require('../Controllers/updates');
module.exports = async function (req, res, next) {
    let userId = req.params.userId;
    let updatedInfo = {};
    if (req.body.paymentInfo) { updatedInfo.paymentInfo = req.body.paymentInfo; }
    if (req.body.email) { updatedInfo.email = req.body.email; }
    if (req.body.password) { updatedInfo.password = req.body.password; }
    if (req.body.gender) { updatedInfo.gender = req.body.gender; }
    if (req.body.phoneNumber) { updatedInfo.phoneNumber = req.body.phoneNumber; }
        updateController.updateUserById(userId, updatedInfo, function(err, updated) {
            if(err)
                return next(err);
            if(!updated)
                return res.status(400).send({
                    error: 'Password can not be the same as any previous ones.'
                });
            res.status(200).send({
                message: 'user successfully updated'
            })
        });
};