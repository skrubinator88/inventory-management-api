const uuidv4 = require('uuid/v4');
const createNotification = ({ alert = '', badge = 1, sound = 'ping.aiff'} = { }) => ({
    badge,
    sound,
    alert
});

const createNotificationObject = ({ type = '', objectId = null, id = null} = { }) => ({
    type,
    objectId: objectId || uuidv4(),
    id: id
});

module.exports = {
    createNotification,
    createNotificationObject
};