'use strict';
const dbmain = require('../../../config/DB/DBmain');
const validateController = require('../Controllers/validations');
const uuidv4 = require('uuid/v4');

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
                    password: info.password
                }
            }).spread((user, created) => {
                if(created) {
                    console.log('new user created ' + user.id);
                    return cb(null, user);
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
    }
};