"use strict";
const authService = require('../Services/authService');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config_env')[env];
//route used for creating a new user
module.exports = function (req, res, next) {
    const schema = Joi.object().keys({
        email: Joi.string().email(),
        password: Joi.string().regex(
            //password must contain letters or numbers
            //and be a minumum of 6 characters, maximum 30
            new RegExp('^[a-zA-Z0-9]{6,30}$')
        ),
        phoneNumber: Joi.number(),
        PropertyId: Joi.string()
    });
    const {error, value} = Joi.validate(req.body, schema);
    if (error) {
        switch (error.details[0].context.key) {
        case 'email':
            res.status(400).send({
                error: 'please provide valid email address'
            });
            break;
        case 'password':
            res.status(400).send({
                error: 'please provide a valid password'
            });
            break;
        default:
            return next(error);
        }
    } else {
        authService.registerPropertyAdmin(req.body, function (err, propertyAdmin, info) {
            if (err) {
                return next(err);
            }
            if (!propertyAdmin) {
                console.log(info.message);
                res.status(401).send({
                    error: info.message
                });
            } else {
                const token = jwt.sign(propertyAdmin.get(), config.jwt_secret, {expiresIn: '1h'});
                res.json({
                    id: propertyAdmin.id,
                    name: propertyAdmin.propertyName,
                    accountId: propertyAdmin.PropertyId,
                    email: propertyAdmin.email,
                    number: propertyAdmin.phoneNumber,
                    payInfo: propertyAdmin.paymentInfo,
                    token
                });
            }
        });
    }
};