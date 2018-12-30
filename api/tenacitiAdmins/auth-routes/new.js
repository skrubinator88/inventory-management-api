"use strict";
const { registerTenacitiAdmin } = require('../Services/profileAuthService');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config_env')[env];
const { validateHash } = require('../../Helpers/validations');

//route used for creating a new user
module.exports = function (req, res, next) {
    const schema = Joi.object().keys({
        username: Joi.string().email(),
        password: Joi.string().regex(
            //password must contain letters or numbers
            //and be a minumum of 6 characters, maximum 30
            new RegExp('^[a-zA-Z0-9]{6,30}$')
        ),
        accessKey: Joi.string()
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
        case 'accessKey':
            res.status(400).send({
                error: 'please provide access key'
            });
            break;
        default:
            res.status(400).end();
        }
    } else {
        validateHash(config.super_user_access_key, req.body.accessKey, (err, match) => {
            if(err) {
                console.log(err);
                return res.status(500).send({
                    error: 'An error occurred while validating access key'
                });
            }
            if(!match) {
                return res.status(400).send({
                    error: 'Invalid access key'
                });
            }
            else{
                registerTenacitiAdmin(req.body, function (err, admin, info) {
                    if (err) {
                        return next(err);
                    }
                    if (!admin) {
                        res.status(400).send({
                            error: info.message
                        });
                    } else {
                        try {
                            const token = jwt.sign(admin.get(), config.jwt_secret, {expiresIn: '1h'});
                            res.json({
                                adminId: admin.id,
                                email: admin.email,
                                token
                            });
                        } catch(err) {
                            return next(err);
                        }
                    }
                });
            }
        })
    }
};