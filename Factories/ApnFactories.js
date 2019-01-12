const createNotification = ({ alert = '', badge = 1, sound = 'ping.aiff'} = { }) => ({
    badge,
    sound,
    alert
});

module.exports = {
    createNotification
};