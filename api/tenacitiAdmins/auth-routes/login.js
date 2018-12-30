"use strict";
const { signInAdmin } = require('../Services/profileAuthService');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config_env')[env];

//route used for logging a user in
module.exports = function (req, res, next) {
    const schema = Joi.object().keys({
        username: Joi.string().email(),
        password: Joi.string().regex(
            //password must contain letters or numbers
            //and be a minumum of 6 characters, maximum 30
            new RegExp('^[a-zA-Z0-9]{6,30}$')
        )
    });
    const {error, value} = Joi.validate(req.body, schema);
    if (error) {
        switch (error.details[0].context.key) {
            case 'username':
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
        signInAdmin(req.body, function (err, admin, info) {
            if (err) {
                return next(err);
            }
            if (!admin) {
                console.log(info.message);
                res.status(400).send({
                    error: info.message
                });
            } else {
                try {
                    const token = jwt.sign(admin.get(), config.jwt_secret, {expiresIn: '1h'});
                    console.log(token);
                    res.json({
                        adminId: admin.id,
                        email: admin.email,
                        token
                    });
                } catch (error) {
                    return next(err);
                }
            }
        });
    }
};