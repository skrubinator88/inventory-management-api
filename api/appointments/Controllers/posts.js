'use strict';
const dbmain = require('../../../config/DB/DBmain');
const uuidv4 = require('uuid/v4');

module.exports = {
    async addPropertyUnitAppointment (opts, cb) {
        let Appointment = dbmain.model('Appointment');
        try {
            let infoObject = {
                    id: uuidv4(),
                    date: opts.date,
                    PropertyUnitId: opts.PropertyUnitId,
                    UserId: opts.UserId
            };
            console.log(infoObject);
            let appointment = await Appointment.create(infoObject);
            let response = {
                date: appointment.date,
                status: appointment.status,
                propertyUnitId: appointment.PropertyUnitId,
                id: appointment.id
            };
            cb(null, response);
        } catch (err) {
            console.error(err);
            cb(err);
        }
    }
};