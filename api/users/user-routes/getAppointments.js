'use strict';
const { getAppointments } = require('../Controllers/queries');
module.exports = async function (req, res, next) {
    let userId = req.params.userId;
    let infoObject = {
        UserId: userId
    };
    getAppointments(infoObject, (err, appointments) => {
        if(err) {
            return next(err);
        }
        res.status(200).send(appointments);
    })
};