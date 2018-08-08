'use strict';
/*
* PassPort service for registering both barbers and clients
*
* Provides different strategies for signing in and signing up users.
*
* Sequelize models are used to declare different search queries for authentication
*
* Models Used:
*   - Barber User
*   - Client User
*
* Strategies used:
* Local SignIn
*   - Used to verify users when signing in API with username/email and password
*   - Email is used instead of username to search for User in database if client is signing in
*   - Username is used to lookup user if barber is signing in
*
* Local SignUp
*   - Used to verify users when attempting to create a new account with username or email/password
*/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dbmain = require('../../../config/DB/DBmain');
const Sequelize = require('sequelize');
const UserController = require('../Controllers/validations');

const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config_env')[env];

let opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.jwt_secret;

// //serializes user id to session on each auth request after signin
// passport.serializeUser((user, done) => {
//     console.log('serialized');
//     done(null, user.get().id);
// });
// //removes user with id from session
// passport.deserializeUser((id, done) => {
//     let User = dbmain.model("User");
//     User.findById(id)
//         .then((user,err) => {
//             done(err, user);
//         });
// });

passport.use('user-jwt', new JWTStrategy(opts, function(jwtPayload, cb) {
    let User = dbmain.model("User");
    return User.findById(jwtPayload.id)
        .then((user) => {
            let response = {
                email: user.username,
                payInfo: user.paymentInfo
            };
            return cb(null, response)
        }).catch(err => {
            return cb(err)
        })
}));

//Local signin strategy used for verfying and logging in existing users
passport.use('user-signin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (username, password, done) => {
            //looks for client with matching email
            let User = dbmain.model("User");
            let Hairtype = dbmain.model("Hairtype");
            let Photo = dbmain.model("Photo");
            let Location = dbmain.model("Location");
            User.findOne(
                {where: {email: username},
                include: [
                {
                    model: Hairtype,
                    model: Photo,
                    model: Location, as: 'UserPosition'
                }
            ]
            })
                .then((user, err) => {
                    //respond with error if any are found
                    if (err) {return done(err);}
                    //if no user is found prompt user that email is incorrect
                    if (!user) {
                        console.log("User has incorrect email");
                        return done(null, false, {message: 'Incorrect email'})
                    }
                    //if password validation fails prompt user that password is incorrect
                    if ((UserController.validatePassword(user, password))) {
                        console.log("User has incorrect password");
                        return done(null, false, {message: 'Incorrect password'})
                    }
                    // if(tempUser.validatePassword(user, password)){
                    else{
                        //if nothing fails, complete request and respond with user object
                        console.log("login successful");
                        return done(null, user);
                    }
                })
        })
    );

//Local Sign Up strategy used for verifying and creating new users
passport.use('user-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, username, password, done) => {
            let User = dbmain.model("User");
            console.log('checking for user existence...');
            User
                .findOrCreate({ //look for existing user or create new
                    where: { email: username},
                    defaults: {
                        status: req.body.status || 'active',
                        phoneNumber: req.body.phoneNumber || null,
                        gender: req.body.gender || null,
                        paymentInfo: req.body.paymentInfo || null,
                        passwordHash: password,
                    }
                })
                .spread((user, created) => {
                    if(user && (created === true)) {  //if user is created return user in callback
                        console.log('new user created with id: ' + user.get().id);
                        return done(null, user);
                    }
                    else{   //if user is not created respond with error message
                        console.log('User has already been created');
                        return done(null, created, {message: 'User already exists'})
                    }

                }).catch(Sequelize.ValidationError, function (err) {
                    return err;
            });
}));
module.exports = passport;