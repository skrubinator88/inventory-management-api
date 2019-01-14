'use strict';

const dbmain = require('../../../config/DB/DBmain');
const client = require('../../../config/Redis');
const apnProvider = require('../../../config/apnManager');
const { createNotification } = require('../../../Factories/ApnFactories');

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
        let PropertyUnit = dbmain.model('PropertyUnit');
        let Property = dbmain.model('Property');
        try {
            Appointment.update(
               opts, { returning: true, where: { id: id } }
            ).then(async function([rowsUpdated, [appointmentUpdated]]) {
                if(!appointmentUpdated)
                    return cb(null, false);
                try {
                    let user = await client.getKeyValue('users', appointmentUpdated.UserId);
                    let propertyUnit = await PropertyUnit.findById(appointmentUpdated.PropertyUnitId);
                    let property = await Property.findById(propertyUnit.PropertyId);
                    let notification = createNotification({alert: `${property.propertyName} has updated your appointment request`, badge: user.badge, sound: 'ping.aiff'});
                    notification.payload = {
                        id: appointmentUpdated.id,
                        type: "appointment"
                    };
                    user.badge++;
                    apnProvider.sendNotification(user.deviceToken, notification, function(err, info) {
                        if(err)
                            throw err;
                        console.log(info);
                    });
                    await client.setKeyValue('users', user.id, user);
                } catch (err) {
                    throw err
                }
                return cb(null, true)
            })
        } catch (err) {
            console.error(err);
            cb(err);
        }
    }
};