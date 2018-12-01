'use strict';
const { sendPasswordResetLink } = require('../Services/profileAuthService');
module.exports = function(req,res,next) {
    if(!req.params.email)
        return res.status(400).send({
            error: 'Invalid link'
        });
    sendPasswordResetLink(req.params.email, function(err,sent) {
        if(err)
            return next(err);
        if(!sent)
            return res.status(401).send({
                error: 'user not found'
            });
        return res.status(200).send({
            message: 'password reset link has been sent'
        });
    })
};