'use strict';
const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config_env')[env];
const { verifyUser } = require('../Services/profileAuthService');

module.exports = async function(req, res, next) {
    let token = req.params.token;
    try {
        let data = await jwt.verify(token,config.jwt_confirm_email);
        if(new Date(data.expiry).getTime() > (new Date().getTime())) {
            verifyUser(data.user, function(err, update) {
                if(err) {
                    console.log(err)
                    return next(err)
                }
                if(!update) {
                    return res.status(500).send({
                        error: 'An error occurred while trying to update user'
                    })
                }
                return res.status(200).send({
                    id: data.user.id
                })
            });
        } else {
            console.log('link is expired');
            res.status(400).send({
                error: 'link is expired'
            })
        }
    } catch (err) {
        console.log(err)
        return next(err)
    }
};