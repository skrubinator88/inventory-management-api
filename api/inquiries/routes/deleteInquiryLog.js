const updateController = require('../Controllers/updates');

module.exports = async function (req, res, next) {
    let inquiryLogId = parseInt(req.params.inquiryLogId);
    if (Number.isNaN(inquiryLogId)) {
        res.status(400).send({
            error: 'property unit id must be a number'
        });
        return;
    }

    updateController.deleteInquiryLog(inquiryLogId, function(err, complete) {
        if(err) {
            return next(err);
        }
        if(complete) {
            res.status(204).send('inquiry log successfully deleted.')
        }
    })
};