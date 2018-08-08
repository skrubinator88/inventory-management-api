const passport = require('passport');
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config_env')[env];
const LocalStrategy = require('passport-local').Strategy;
const dbmain = require('../../../config/DB/DBmain');
const Sequelize = dbmain.Seq;
const property_owner_controller = require('../users/controllers/PropertyOwnerController');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

 let opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.jwt_secret;

passport.use('propertyOwner_jwt', new JWTStrategy(opts, function(jwtPayload, cb) {
    let property_owner = dbmain.model("PropertyOwnerAdmin");
    return property_owner.findById(jwtPayload.id)
        .then(user => {
            let owner = {
                username: user.username,
                propertyId: user.PropertyOwnerId,
                payInfo: user.paymentInfo
            };
            return cb(null, owner)
        }).catch(err => {
            return cb(err)
        })
}));
//Signup strategies
//passport strategy for local property owner signup
passport.use('new_property_admin', new LocalStrategy({
   usernameField: 'username',
   passwordField: 'password',
   passReqToCallback: true
}, (req, username, password, done) => {
    let property_owner = dbmain.model('PropertyOwnerAdmin');
    property_owner
        .findOrCreate({
            where: {username: username},
            defaults: {
                password: req.body.password,
                PropertyOwnerId: req.body.PropertyOwnerId
            }
        }).spread((user, created) => {
            if(user) {
                console.log('new property owner has been created ' + user.id);
                return done(null, user);
            } else{   //if user is not created respond with error message
                console.log('Property Owner has already been created');
                return done(null, created, {message: 'Property Owner already has an account'})
            }
    }).catch((err) => {
        throw err;
    });
}));
//passport strategy for local tenaciti admin signup
passport.use('new_tenaciti_admin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {

}));
//passport strategy for local client user signup
passport.use('new_user', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    let client_user = dbmain.model('User');
    client_user
        .findOrCreate({
            where: {email: username},
            defaults: {
                password: req.body.password,
                name: req.body.name
            }
        }).spread((user, created) => {
        if(user) {
            console.log('new user has been created ' + user.id);
            return done(null, user);
        } else{   //if user is not created respond with error message
            console.log('User has already been created');
            return done(null, created, {message: 'User already has an account'})
        }
    }).catch((err) => {
        throw err;
    });
}));

//Signin strategies
//passport strategy for local property owner signin
passport.use('login_property_admin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    let property_owner = dbmain.model('PropertyOwnerAdmin');
    property_owner.findOne({
        where: {username: username}
    }).then( (user, err) => {
        if(err) throw err;

        if(!user) {
            console.log('Property Owner has invalid credentials');
            return done(null, false, {message: 'Invalid username or password'})
        }
        property_owner_controller.validatePassword(user, req, (match => {
            if(!match) {
                console.log('Property Owner has invalid credentials');
                return done(null, false, {message: 'Invalid username or password'})
            }
            else{
                console.log("login successful");
                return done(null, user);
            }
        }))
    })
}));
//passport strategy for local tenaciti admin signin
passport.use('login_tenaciti_admin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {

}));
//passport strategy for local client user signin
passport.use('login_user', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {

}));
module.exports = passport;