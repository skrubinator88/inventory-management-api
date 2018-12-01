'use strict';
const dbmain = require('../../../config/DB/DBmain');
const validateController = require('../Controllers/validations');
const uuidv4 = require('uuid/v4');
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config_env')[env];
const stripe = require('stripe')(config.stripe.secret_key);
const mailer = require('../../Helpers/mailManager/mail');
const jwt = require('jsonwebtoken');
const { updateUserById } = require('../Controllers/updates');

module.exports = {
    async registerUser (info, cb) {
        let User = dbmain.model('User');
        try {
            await User.findOrCreate({
                where: { email: info.email.toLowerCase() },
                defaults: {
                    id: uuidv4(),
                    firstName: info.firstName,
                    lastName: info.lastName,
                    status: info.status || 'active',
                    phoneNumber: info.phoneNumber || null,
                    gender: info.gender || null,
                    paymentInfo: info.paymentInfo || null,
                    password: info.password,
                    deviceToken: info.deviceToken.length > 2 ? info.deviceToken : null
                }
            }).spread((user, created) => {
                if(created) {
                    let mailOptions = {
                        name: user.firstName,
                        email: user.email
                    };
                    let info = {};
                    info.user = user;
                    info.expiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                    let token = jwt.sign(info,config.jwt_confirm_email);
                    let tokenUrl = `type=user&token=${token}`;
                    mailer.sendConfirmationEmail(mailOptions, tokenUrl);
                    stripe.customers.create({
                        email: user.email,
                    }, async function(err, customer) {
                        if(err)
                            return cb(err);
                        // asynchronously called
                        User.update( { paymentInfo: customer.id }, { where: { id: user.id } })
                            .then(()=> {
                                console.log('new user created ' + user.id);
                                return cb(null, user);
                            }).catch(err => {
                                return cb(err)
                        })
                    });
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
    async signInUser (info, cb) {
        let User = dbmain.model('User');
        try {
            await User.findOne({
                where: {email: info.email.toLowerCase()}
            }).then( (user, err) => {
                if(err) throw err;

                if(!user) {
                    console.log('User has invalid credentials');
                    return cb(null, false, {message: 'Invalid username or password'})
                }
                //validate password
                validateController.validatePassword(user, info.password, (err, match) => {
                    if(err) {
                        throw err
                    }
                    if(!match) {
                        console.log('User has invalid credentials');
                        return cb(null, false, {message: 'Invalid email or password'})
                    }
                    else{
                        console.log("login successful");
                        return cb(null, user);
                    }
                })
            })
        } catch (err) {
            console.error(err);
            cb(err);
        }
    },
    async verifyUser (receivedUser, cb) {
        let User = dbmain.model('User');
        try {
            let user = await User.findById(receivedUser.id);
            if(user) {
                if(!user.isVerified) {
                    let info = {
                        isVerified: true
                    };
                    let update = await updateUserById(user.id,info);
                    if(update) {
                        return cb(null,true);
                    } else {
                        return cb(null,false);
                    }
                }
                return cb(null,true)
            } else {
                return cb(null,false);
            }
        } catch (err) {
            return cb(err)
        }
    },
    async sendPasswordResetLink(email, cb) {
        let User = dbmain.model('User');
        try {
            let users = await User.findAll({ where: { email: email.toLowerCase() } });
            if(users[0]) {
                let user = users[0];
                let mailOptions = {
                    name: user.firstName,
                    email: user.email
                };
                let info = {};
                info.user = user;
                info.expiry = new Date(new Date().getTime() + 15 * 60 * 1000);
                let token = jwt.sign(info,config.jwt_confirm_email);
                let tokenUrl = `type=user&token=${token}`;
                mailer.sendResetPasswordEmail(mailOptions,tokenUrl);
                return cb(null,true)
            } else {
                return cb(null,false)
            }
        } catch (err) {
            return cb(err)
        }
    }
};