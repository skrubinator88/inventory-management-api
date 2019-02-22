const dbmain = require('../../../config/DB/DBmain');
const { validateHash } = require('../../Helpers/validations');

module.exports = {
    async registerPropertyAdmin (info, cb) {
        let PropertyOwnerAdmin = dbmain.model('PropertyOwnerAdmin');
        try {
            await PropertyOwnerAdmin.findOrCreate({
                where: { email: info.email },
                defaults: {
                    password: info.password,
                    phoneNumber: info.phoneNumber,
                    PropertyOwnerId: info.PropertyOwnerId
                }
            }).spread((user, created) => {
                if(created) {
                console.log('new property owner created ' + user.id);
                return cb(null, user);
            } else{   //if user is not created respond with error message
                console.log('Account has already been created');
                return cb(null, created, {message: 'email is already in use'})
            }
            })
        } catch (err) {
            console.error(err);
            cb(err);
        }
    },
    async signInPropertyAdmin (info, cb) {
        let PropertyOwnerAdmin = dbmain.model('PropertyOwnerAdmin');
        try {
            await PropertyOwnerAdmin.findOne({
                where: {email: info.email}
            }).then( (user, err) => {
                if(err) throw err;

                if(!user) {
                    console.log('Admin has invalid credentials');
                    return cb(null, false, {message: 'Invalid username or password'})
                }
                //validate password
                validateHash(user.password, info.password, (err, match) => {
                    if(err) {
                        throw err
                    }
                    if(!match) {
                        console.log('Admin has invalid credentials');
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