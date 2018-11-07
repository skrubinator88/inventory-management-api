const postController = require('../Controllers/posts');

module.exports = async function (req, res, next) {
    let info = {}
    if(req.body.inquiryLogId) {
        info.inquiryLogId = req.body.inquiryLogId
    } else {
     info = {
            propertyId: req.body.propertyId,
            userId: req.body.userId,
            message: req.body.message
            };
    }

    postController.addInquiry(info, function(err, inquiry) {
        if(err) {
            return next(err);
        }
        if(!inquiry) {
            res.status(401).send({
                error: 'There was an error while trying to add inquiry'
            })
        } else {
            res.status(200).send(inquiry);
        }
    })
};