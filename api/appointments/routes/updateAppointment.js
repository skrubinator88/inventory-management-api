'use strict';
const { updateAppointment } = require('../Controllers/updates');
module.exports = async function (req, res, next) {
    let appointmentId = req.params.appointmentId;
    let updatedInfo = {};
    if (req.body.status) { updatedInfo.status = req.body.status; }
    if(req.body.description) { updatedInfo.description = req.body.description }
    updateAppointment(updatedInfo, appointmentId, function(err, completed) {
        if(err) {
            return next(err)
        }
        res.status(200).send(completed)
    });
};