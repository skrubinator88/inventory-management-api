"use strict";
const { addPaymentAccount } = require('../Controllers/posts');
const { startPremiumTrial } = require('../Controllers/updates');
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config_env')[env];
const request = require('request');
//route used for retrieving a specific user
module.exports = async function (req, res, next) {
    if (!req.query.code) {
        return res.status(400).send({
            error: 'No query code provided. Could not make request'
        })
    }
    request.post(config.stripe.tokenUri, {
        form: {
            grant_type: 'authorization_code',
            client_id: config.stripe.clientId,
            client_secret: config.stripe.secret_key,
            code: req.query.code
        },
        json: true
    }, (err, response, body) => {
        console.log(response);
        if(err || body.error) {
            return next(err || body.error);
        } else {
            addPaymentAccount(req.query.state, body.stripe_user_id, function(err, paymentAccount) {
                if(err) {
                    return next(err);
                }
                if(!paymentAccount) {
                    res.status(400).send({
                        error: 'An error occurred while trying to update propertyAdmin'
                    })
                } else {
                    console.log(paymentAccount);
                    startPremiumTrial(req.userId, function (err, hasTrialStarted) {
                        if(err) {
                            return next(err)
                        }
                        if(!hasTrialStarted) {
                            return res.status(400).send({
                                error: 'There was an error while trying to begin premium trial'
                            })
                        } else {
                            res.status(200).send('Premium trial started')
                        }
                    });
                }
            })
        }
    })
};