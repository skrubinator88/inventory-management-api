const env = process.env.NODE_ENV || 'development';
const dbmain = require('../../../config/DB/DBmain');
const { validateHash } = require('../../Helpers/validations');
const uuidv4 = require('uuid/v4');

module.exports = {
    async registerPropertyAdmin (info, cb) {
        let PropertyAdmin = dbmain.model('PropertyAdmin');
        let Property = dbmain.model('Property');
        try {
            await PropertyAdmin.findOrCreate({
                where: { email: info.email },
                defaults: {
                    id: uuidv4(),
                    password: info.password,
                    phoneNumber: info.phoneNumber,
                    PropertyId: info.PropertyId
                }
            }).spread(async (user, created) => {
                if(created) {
                    console.log('new property admin created ' + user.id);
                    let propertyAccount = await Property.findById(info.PropertyId);
                    user.propertyName = propertyAccount.propertyName
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
        let PropertyAdmin = dbmain.model('PropertyAdmin');
        let Property = dbmain.model('Property');
        try {
            await PropertyAdmin.findOne({
                where: {email: info.email}
            }).then( (user, err) => {
                if(err) throw err;

                if(!user) {
                    console.log('Admin has invalid credentials');
                    return cb(null, false, {message: 'Invalid username or password'})
                }
                //validate password
                validateHash(user.password, info.password, async (err, match) => {
                    if(err) {
                        throw err
                    }
                    if(!match) {
                        console.log('Admin has invalid credentials');
                        return cb(null, false, {message: 'Invalid email or password'})
                    }
                    else{
                        console.log("login successful");
                        let propertyAccount = await Property.findById(user.PropertyId);
                        user.propertyName = propertyAccount.propertyName
                        return cb(null, user);
                    }
                })
            })
        } catch (err) {
            console.error(err);
            cb(err);
        }
    },
    async signInTenantPortal (info, cb) {
        let PropertyAdmin = dbmain.model('PropertyAdmin');
        try {
            await PropertyAdmin.findOne({
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
                        if(user.isPremium === true) {
                            console.log("login successful");
                            return cb(null, user);
                        } else {
                            return cb(null, false, {message: 'User does not have permitted access.'});
                        }
                    }
                })
            })
        } catch (err) {
            console.error(err);
            cb(err);
        }
    }
};