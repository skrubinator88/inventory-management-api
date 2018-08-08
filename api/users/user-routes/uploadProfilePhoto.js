'use strict';
const uploadService = require('../Services/fileUploadService');
module.exports = function (req, res, next) {
    let userId = parseInt(req.params.userId);
    if (Number.isNaN(userId)) {
        res.status(400).send({
            error: 'user id must be a number'
        });
        return;
    }

    uploadService(req, res, (err) => {
        if(err) {
            return next(err);
        }
        console.log(req.file);
        res.status(200).end();
    });
};