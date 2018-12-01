const postController = require('../Controllers/posts');

module.exports = async function (req, res, next) {
    let propertyUnitId = req.params.propertyUnitId;
    let info = {
        UserId: req.userId,
        PropertyUnitId: propertyUnitId,
        date: req.body.date
    };
    postController.addPropertyUnitAppointment(info, function(err, appointment) {
        if(err) {
            return next(err);
        }
        if(!appointment) {
            res.status(500).send({
                error: 'There was an error while trying to create appointment'
            })
        } else {
            console.log(appointment);
            res.status(200).send(appointment);
        }
    })
};