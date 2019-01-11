'use strict';
const apn = require('apn');
const env = process.env.NODE_ENV || 'development';
const config = require('./config_env')[env];

let apnProvider;

module.exports = {
    async sendNotification(deviceToken, opts, cb) {
        apnProvider = apn.Provider(config.apn_options);
        let notification = new apn.Notification();
        notification.topic = config.ios_settings.bundleId;
        notification.badge = opts.badge;
        notification.sound = opts.sound;
        notification.alert = opts.alert;
        try {
            let info = await apnProvider.send(notification,deviceToken);
            apnProvider.shutdown()
            cb(null,info)
        } catch (err) {
            cb(err)
        }
    }
};