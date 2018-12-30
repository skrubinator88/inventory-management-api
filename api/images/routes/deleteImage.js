const updateController = require('../Controllers/updates');

module.exports = async function (req, res, next) {
    let applicationId = req.params.applicationId;
    updateController.deleteApplication(applicationId, function(err, complete) {
        if(err) {
            return next(err);
        }
        if(complete) {
            res.status(204).send('application successfully deleted.')
        }
    })
};