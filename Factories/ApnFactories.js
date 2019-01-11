const createNotification = ({ alert = '', badge = 3, sound = 'ping.aiff'} = { }) => ({
    badge,
    sound,
    alert
});

module.exports = {
    createNotification
};