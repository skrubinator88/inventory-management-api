"use strict";
const { getUserById } = require('../Controllers/queries');
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config_env')[env];
const stripe = require('stripe')(config.stripe.secret_key);
module.exports = async function (req, res, next) {
    const stripe_version = req.query.api_version;
    if (!stripe_version) {
        res.status(400).end();
        return;
    }
    getUserById(req.userId, function(err, user) {
        if(err) {
            return next(err);
        }
        if(!user) {
            return res.status(400).send({
                error: 'No user found. Please try again'
            })
        } else {
            stripe.ephemeralKeys.create(
                {customer: user.paymentInfo},
                {stripe_version: stripe_version},
                function(err, key) {
                    if(err)
                        return next(err);
                return res.status(200).json(key);
            });
        }
    })

};