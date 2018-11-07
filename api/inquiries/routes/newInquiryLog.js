const postController = require('../Controllers/posts');

module.exports = async function (req, res, next) {
    let info = {
        userId: req.body.userId,
        propertyId: req.body.propertyId
    };
    postController.createInquiryLog(info, function(err, inquiryLog) {
        if(err) {
            return next(err);
        }
        if(!inquiryLog) {
            res.status(401).send({
                error: 'There was an error while trying to create inquiryLog'
            })
        } else {
            res.status(200).send(inquiryLog);
        }
    })
};