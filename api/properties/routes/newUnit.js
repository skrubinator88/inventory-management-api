const { addPropertyUnit } = require('../Controllers/posts');

module.exports = async function (req, res, next) {
    if(!req.params.propertyId) {
        return res.status(400).send({
            error: 'Property Id must be provided'
        })
    }
    let propertyId = req.params.propertyId;
    addPropertyUnit(propertyId, req.body, function(err, propertyUnit) {
        if(err) {
            return next(err);
        }
        if(!propertyUnit) {
            res.status(500).send({
                error: 'There was an error while trying to create property unit'
            })
        } else {
            console.log(propertyUnit);
            res.status(200).send(propertyUnit);
        }
    })
};