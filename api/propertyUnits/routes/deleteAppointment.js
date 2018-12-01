const updateController = require('../Controllers/updates');

module.exports = async function (req, res, next) {
    let propertyUnitId = req.params.propertyUnitId;
    let info = {
        id: req.params.appointmentId
    };
    updateController.deletePropertyUnitAppointment(info, function(err, complete) {
        if(err) {
            return next(err);
        }
        if(complete) {
            res.status(200).send('appointment successfully deleted.')
        }
    })
};