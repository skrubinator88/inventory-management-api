"use strict";
const authService = require('../Services/authService');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config_env')[env];

//route used for logging a user in
module.exports = function (req, res, next) {
    const schema = Joi.object().keys({
        email: Joi.string().email(),
        password: Joi.string().regex(
            //password must contain letters or numbers
            //and be a minumum of 6 characters, maximum 30
            new RegExp('^[a-zA-Z0-9]{6,30}$')
        )
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
                res.status(400).end();
        }
    } else {
        authService.signInPropertyAdmin(req.body, function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                console.log(info.message);
                res.status(401).send({
                    error: info.message
                });
            } else {
                const token = jwt.sign(user.get(), config.jwt_secret, {expiresIn: '12h'});
                console.log(token);
                res.json({
                    id: user.id,
                    accountId: user.PropertyOwnerId,
                    email: user.email,
                    number: user.phoneNumber,
                    payInfo: user.paymentInfo,
                    token
                });
            }
        });
    }
};