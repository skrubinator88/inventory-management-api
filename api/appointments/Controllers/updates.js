'use strict';

const dbmain = require('../../../config/DB/DBmain');

module.exports = {
    async deletePropertyUnitAppointment (opts, cb) {
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
    },
    async updateAppointment (opts, id, cb) {
        let Appointment = dbmain.model('Appointment');
        try {
            Appointment.update(
               opts, { returning: true, where: { id: id } }
            ).then(function([rowsUpdated, [accountUpdated]]) {
                if(!accountUpdated)
                    return cb(null, false);
                return cb(null, true)
            })
        } catch (err) {
            console.error(err);
            cb(err);
        }
    }
};