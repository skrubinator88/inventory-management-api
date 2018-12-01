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
        notification.badge = opts.badge || 3;
        notification.sound = 'ping.aiff';
        notification.alert = opts.message;
        try {
            let info = await apnProvider.send(notification,deviceToken);
            cb(null,info)
            apnProvider.shutdown()
        } catch (err) {
            cb(err)
        }
    }
};