const passport = require('passport');
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config_env')[env];
const LocalStrategy = require('passport-local').Strategy;
const dbmain = require('../../../config/DB/DBmain');
const validateController = require('../../Helpers/validations');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const uuidv4 = require('uuid/v4');
const JWTStrategy = passportJWT.Strategy;

let opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.jwt_secret;

module.exports = {
    passport,
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
                validateController.validatePassword(user, info.password, async (err, match) => {
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
                validateController.validatePassword(user, info.password, (err, match) => {
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

//Signup strategies
//passport strategy for local property owner signup
// passport.use('new_property_admin', new LocalStrategy({
//    usernameField: 'email',
//    passwordField: 'password',
//    passReqToCallback: true
// }, (req, username, password, done) => {
//     let property_owner = dbmain.model('PropertyOwnerAdmin');
//     property_owner
//         .findOrCreate({
//             where: { email: username },
//             defaults: {
//                 password: password,
//                 phoneNumber: req.body.phoneNumber,
//                 PropertyOwnerId: req.body.PropertyOwnerId
//             }
//         }).spread((user, created) => {
//             if(user) {
//                 console.log('new property owner created ' + user.id);
//                 return done(null, user);
//             } else{   //if user is not created respond with error message
//                 console.log('Property Owner has already been created');
//                 return done(null, created, {message: 'Property Owner already has an account'})
//             }
//     }).catch((err) => {
//         throw err;
//     });
// }));
// //Signin strategies
// //passport strategy for local property owner signin
// passport.use('login_property_admin', new LocalStrategy({
//     usernameField: 'username',
//     passwordField: 'password',
//     passReqToCallback: true
// }, (req, username, password, done) => {
//     let property_owner = dbmain.model('PropertyOwnerAdmin');
//     property_owner.findOne({
//         where: {username: username}
//     }).then( (user, err) => {
//         if(err) throw err;
//
//         if(!user) {
//             console.log('Property Owner has invalid credentials');
//             return done(null, false, {message: 'Invalid username or password'})
//         }
//         validateController.validatePassword(user, req, (match => {
//             if(!match) {
//                 console.log('Property Owner has invalid credentials');
//                 return done(null, false, {message: 'Invalid username or password'})
//             }
//             else{
//                 console.log("login successful");
//                 return done(null, user);
//             }
//         }))
//     })
// }));