const { addProperty } = require('../Controllers/posts');

module.exports = async function (req, res, next) {
    addProperty(req.body, function(err, property) {
        if(err) {
            return next(err);
        }
        if(!property) {
            res.status(500).send({
                error: 'There was an error while trying to create property'
            })
        } else {
            console.log(property);
            res.status(200).send(property);
        }
    })
};