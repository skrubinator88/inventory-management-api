'use strict';
/*
* Update Functions for handling Property Routes
* startPremiumTrial:
* updatePropertyById: Function used to update */
const dbmain = require('../../../config/DB/DBmain');
const moment = require('moment');
const Moment = moment();
const { chargePropertyCustomer, createToken } = require('../../Helpers/stripe');
const { sendApplicationSignUpEmail } = require('../../Helpers/mailManager/mail');

module.exports = {
    /*
    * Description: Function used to update the Premium Trial Start Date in PropertyAdmin DB Table
    * Parameters: id is the propertyAdmin DB id, cb is a callback function returned at end of function
    * */
    async startPremiumTrial (id, cb) {
        let Admin = dbmain.model('PropertyAdmin');
        try {
            Admin.update(
                {
                    premiumExpiryDate: Moment.add(30, 'days').calendar(),
                    isPremium: true,
                    premiumTrialUsed: true
                },
                { returning: true, where: { id: id } }
            ).then(function([rowsUpdated, [accountUpdated]]) {
                if(!accountUpdated)
                    return cb(null, false)
                return cb(null, true)
            }).catch(err => {
                return cb(err);
            })
        } catch (err) {
            console.error(err);
            return cb(err);
        }
    },
    /*
    * Description: Function used to update a Property using updated values in query object
    * Parameters: propertyId is the property DB id, opts is a query object containing all updated values, and
    *             cb is a callback function returned at end of function
    * */
    async updatePropertyById(propertyId, opts, cb) {
        let Property = dbmain.model('Property');
        console.log(opts);
        try {
            Property.update(opts, { returning: true, where: { id: propertyId } })
                .then(function([rowsUpdated, [ propertyUpdated ]]) {
                    if(!propertyUpdated)
                        return cb(null, false);
                    return cb(null, true);
                })
        } catch (err) {
            console.log(err);
            return cb(err);
        }
    },
    /*
    * Description: Function used to create a stripe charge for a given user, and either returns a boolean
    *              or an application request info object
    * Parameters: opts is a query object containing userId and propertyId, and
    *             cb is a callback function returned at end of function
    * */
    async createUserCharge (opts, cb) {
        //instantiate DB Models
        let Property = dbmain.model('Property');
        let User = dbmain.model('User');
        let PaymentAccount = dbmain.model('PaymentAccount');
        let ApplicationRequest = dbmain.model('ApplicationRequest');

        try {
            let user = await User.findById(opts.userId);
            let property = await Property.findById(opts.propertyId);

            //look for payment account associated with property and check if exists
            let paymentAccount = (await PaymentAccount.findAll( { where: { PropertyId: property.id } } ))[0];
            if (paymentAccount) {
                //create stripe charge for transaction, then charge user
                let token = await createToken(paymentAccount.stripeAccountId,user.paymentInfo);
                let charge = await chargePropertyCustomer(paymentAccount.stripeAccountId, token.id, property.applicationFee * 100);
                //check to see if charge was completed successfully and if not end function
                if (charge) {
                    //update the initial application request to processing status
                    ApplicationRequest.update({ status: 'PROCESSING' }, {returning: true, where: {PropertyId: property.id, UserId: user.id}})
                        .then(function ([rowsUpdated, [propertyUpdated]]) {
                            if (!propertyUpdated)
                                return cb(null, false);
                            //return application request info
                            return cb(null, {
                                id: propertyUpdated.id,
                                propertyId: propertyUpdated.PropertyId,
                                userId: propertyUpdated.UserId,
                                status: propertyUpdated.status,
                                propertyName: propertyUpdated.propertyName,
                                date: propertyUpdated.createdAt
                            });
                        }).catch(err => { return cb(err) })
                }
                else {
                    let userInfo = {
                        name: user.name,
                        email: user.email
                    };
                    sendApplicationSignUpEmail(property.propertyName, userInfo, function(err, sent) {
                        if(err) console.log(err);
                    });
                    return cb(null, false)
                }
            } else {
                // sendApplicationSignUpEmail()
                return cb(null, false)
            }
        } catch (err) {
            return cb(err)
        }
    },
    /*
    * Description: Function used to delete a specified property, and returns true or false if completed successfully
    * Parameters: opts is a query object containing an id, and
    *             cb is a callback function returned at end of function
    * */
    async deleteProperty (opts, cb) {
        let Property = dbmain.model('Property');
        try {
            //create query object using propertyId
            let infoObject = {
                id: opts.id
            };

            console.log(infoObject);
            Property.update({ status: 'DELETED' }, {returning: true, where: {id: opts.id}})
                .then(function ([rowsUpdated, [propertyUpdated]]) {
                    if (!propertyUpdated)
                        return cb(null, false);
                    return cb(null, true);
                }).catch(err => { return cb(err) })
            cb(null, true);
        } catch (err) {
            console.error(err);
            cb(err);
        }
    }
};