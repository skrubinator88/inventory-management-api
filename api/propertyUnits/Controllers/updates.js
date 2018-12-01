'use strict';

const dbmain = require('../../../config/DB/DBmain');

module.exports = {
    async deletePropertyUnitAppointment (opts, cb) {
        let PropertyUnit = dbmain.model('PropertyUnit');
        let Appointment = dbmain.model('Appointment');
        try {
            let infoObject = {
                id: opts.id
            };
            console.log(infoObject);
            let appointment = await Appointment.destroy({
                where: infoObject
            });
            cb(null, true);
        } catch (err) {
            console.error(err);
            cb(err);
        }
    }
};