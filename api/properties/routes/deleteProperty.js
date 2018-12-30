const { deleteProperty } = require('../Controllers/updates');

module.exports = async function (req, res, next) {
    let propertyId = req.params.propertyId;
    let info = {
        id: propertyId
    };
    deleteProperty(info, function(err, complete) {
        if(err) {
            return next(err);
        }
        if(complete) {
            res.status(204).send('property successfully deleted.')
        }
    })
};