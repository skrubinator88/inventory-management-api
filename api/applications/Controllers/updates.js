'use strict';

const dbmain = require('../../../config/DB/DBmain');
const client = require('../../../config/Redis');
const apnProvider = require('../../../config/apnManager');
const { createNotification, createNotificationObject } = require('../../../Factories/ApnFactories');
// const { sendNotification } = require('../../../config/apnManager');

module.exports = {
    async deleteApplication (applicationId, cb) {
        let Application = dbmain.model('ApplicationRequest');
        try {
            await Application.destroy({
                where: {
                    id: applicationId
                }
            });
            cb(null, true);
        } catch (err) {
            console.error(err);
            cb(err);
        }
    },
    async updateApplication (opts, id, cb) {
        let Application = dbmain.model('ApplicationRequest');
        let Property = dbmain.model('Property');
        try {
            Application.update(
               opts, { returning: true, where: { id: id } }
            ).then(async function([rowsUpdated, [applicationUpdated]]) {
                if(!applicationUpdated)
                    return cb(null, false);
                    let user = await client.getKeyValue('users', applicationUpdated.UserId);
                    let property = await Property.findById(applicationUpdated.PropertyId);
                    let notification = createNotification({alert: `${property.propertyName} has updated your application request`, badge: user.badge, sound: 'ping.aiff'});
                    notification.payload = {
                        id: applicationUpdated.id,
                        type: "application"
                    };
                    user.badge++;
                    let notifObject = createNotificationObject({type: "application", id: applicationUpdated.id});
                    console.log(notifObject);
                    user.notifications.push(notifObject.objectId);
                    console.log("Notification: ", notification);
                    apnProvider.sendNotification(user.deviceToken, notification, function(err, info) {
                        if(err)
                            throw err;
                        console.log(info);
                    });
                    await client.setKeyValue('notifications', notifObject.objectId, notifObject);
                    await client.setKeyValue('users', user.id, user);
                return cb(null, true)
            })
        } catch (err) {
            console.error(err);
            cb(err);
        }
    }
};