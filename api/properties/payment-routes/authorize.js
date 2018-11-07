"use strict";
const { getPropertyAdminById } = require('../Controllers/queries');
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config_env')[env];
//route used for retrieving a specific user
module.exports = async function (req, res, next) {
    getPropertyAdminById(req.userId, function(err, admin) {
        if(err) {
            return next(err);
        }
        if(!admin) {
            return res.status(400).send({
                error: 'No user found. Please try again'
            })
        } else {
            let email = admin.email;
            let phone = admin.phoneNumber;
            let queryString = `?state=${admin.accountId}&stripe_user[email]=${email}&stripe_user[phone]=${phone}&client_id=${config.stripe.client_id}&redirect_uri=${config.stripe.redirect_uri}`;
            res.status(200).send({
                "url": config.stripe.authorizeUri + queryString
            })
        }
    })

};