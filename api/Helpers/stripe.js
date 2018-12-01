'use strict';
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config_env')[env];
const stripe = require("stripe")(config.stripe.secret_key);

module.exports = {
  async createToken(propertyAccountId, customerAccountId) {
      return await stripe.tokens.create({
          customer: customerAccountId,
      }, {
          stripe_account: propertyAccountId,
      })
  },
    async chargePropertyCustomer(propertyAccountId, tokenId, chargeAmount) {
        return await stripe.charges.create({
            amount: chargeAmount,
            currency: 'usd',
            source: tokenId,
        }, {
            stripe_account: propertyAccountId,
        });
    }

};