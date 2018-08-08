const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');

const propertyOwners = require('./api/propertyOwners/routes/index');
const properties = require('./api/properties/routes/index');
const propertyOwnersAuth = require('./api/propertyOwners/auth-routes/index');
const users = require('./api/users/auth-routes/index');
const seeder = require('./seeder/index');

//import db
const dbmain = require("./config/DB/DBmain");
dbmain.setup(__dirname + '/DBModels');

const app = express();

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
app.use(passport.initialize());

app.use('/propertyOwners', propertyOwners);
app.use('/auth/propertyOwners', propertyOwnersAuth);
app.use('/properties', properties);
app.use('/users', users);
app.use('/seed', seeder);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.render('error');
  next();
});

module.exports = app;
