'use strict';
const dbmain = require('../../../config/DB/DBmain');
const { validateHash } = require('../../Helpers/validations');
const uuidv4 = require('uuid/v4');
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config_env')[env];
const mailer = require('../../Helpers/mailManager/mail');
const jwt = require('jsonwebtoken');

module.exports = {
    async registerTenacitiAdmin (info, cb) {
        let TenacitiAdmin = dbmain.model('TenacitiAdmin');
        try {
            await TenacitiAdmin.findOrCreate({
                where: { username: info.username.toLowerCase() },
                defaults: {
                    id: uuidv4(),
                    passwordHash: info.password,
                }
            }).spread((user, created) => {
                if(created) {
                    let mailOptions = {
                        name: "Tenaciti Team Member",
                        email: user.username
                    };
                    let info = {};
                    info.user = user;
                    info.expiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                    let token = jwt.sign(info,config.jwt_confirm_email);
                    let tokenUrl = `type=user&token=${token}`;
                    mailer.sendConfirmationEmail(mailOptions, tokenUrl);
                } else{   //if user is not created respond with error message
                    console.log('Account has already been created');
                    return cb(null, created, { message: 'email is already in use' })
                }
            })
        } catch (err) {
            console.error(err);
            cb(err);
        }
    },
    async signInAdmin (info, cb) {
        let TenacitiAdmin = dbmain.model('TenacitiAdmin');
        try {
            await TenacitiAdmin.findOne({
                where: {username: info.username.toLowerCase()}
            }).then( (admin, err) => {
                if(err) throw err;

                if(!admin) {
                    console.log('Admin has invalid credentials');
                    return cb(null, false, {message: 'Invalid username or password'})
                }
                //validate password
                validateHash(admin.passwordHash, info.password, (err, match) => {
                    if(err) {
                        throw err
                    }
                    if(!match) {
                        console.log('User has invalid credentials');
                        return cb(null, false, {message: 'Invalid email or password'})
                    }
                    else{
                        console.log("login successful");
                        return cb(null, admin);
                    }
                })
            })
        } catch (err) {
            console.error(err);
            cb(err);
        }
    }
};