const { deletePropertyUnit } = require('../Controllers/updates');

module.exports = async function (req, res, next) {
    let propertyUnitId = req.params.propertyUnitId;
    let info = {
        id: propertyUnitId
    };
    deletePropertyUnit(info, function(err, complete) {
        if(err) {
            return next(err);
        }
        if(complete) {
            res.status(200).send('property unit successfully deleted.')
        }
    })
};