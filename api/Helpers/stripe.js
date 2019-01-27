'use strict';
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config_env')[env];
const stripe = require("stripe")(config.stripe.secret_key);

module.exports = {
  async createToken(propertyAccountId, customerAccountId) {
      try {
          return await stripe.tokens.create({
              customer: customerAccountId,
          }, {
              stripe_account: propertyAccountId,
          })
      } catch (err) {
          throw err
      }
  },
    async chargePropertyCustomer(propertyAccountId, tokenId, chargeAmount) {
      try {
          return await stripe.charges.create({
              amount: chargeAmount,
              currency: 'usd',
              source: tokenId,
              destination: {
                  amount: chargeAmount * .30,
                  account: propertyAccountId
              }
          });
      } catch (err) {
          throw err
      }
    }

};