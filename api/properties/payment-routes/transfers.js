"use strict";
const queryController = require('../Controllers/queries');
const stripe = require('stripe');
//route used for retrieving a specific user
module.exports = async function (req, res, next) {
    queryController.getPropertyOwnerAdminById(req.userId, async function(err, admin) {
        if(err) {
            return next(err);
        }
        if(!admin) {
            return res.status(400).send({
                error: 'No user found. Please try again'
            })
        } else {
            try {
                let loginLink = await stripe.accounts.createLoginLink(admin.stripeAccountId);
                res.status(200).send(loginLink)
            } catch (err) {
                res.status(500).send({
                    error: 'An error occurred while trying to create login link.'
                })
            }
        }
    })
};