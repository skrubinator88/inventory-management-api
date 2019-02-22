const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
const helmet = require('helmet');

const propertyOwners = require('./api/propertyOwners/routes/index');
const admins = require('./api/tenacitiAdmins/routes/index');
const properties = require('./api/properties/routes/index');
const inquiryLogs = require('./api/inquiries/routes/index');
const propertyAdminsAuth = require('./api/properties/auth-routes/index');

const propertyUnits = require('./api/propertyUnits/routes/index');
const appointments = require('./api/appointments/routes/index');
const applications = require('./api/applications/routes/index');
const images = require('./api/images/routes/index');
const propertyOwnerAdminsAuth = require('./api/propertyOwners/auth-routes/index');
const propertyAdminPayment = require('./api/properties/payment-routes/index');
const propertyCustomerPayment = require('./api/properties/customer-payment-routes/index');
const userPayment = require('./api/users/payment-routes/index');

const adminAuth = require('./api/tenacitiAdmins/auth-routes/index');
const usersAuth = require('./api/users/auth-routes/index');
const users = require('./api/users/user-routes/index');
const seeder = require('./seeder/index');
const propertyNeighborhoods = require('./api/propertyNeighborhoods/routes/index');

//import db
const dbmain = require("./config/DB/DBmain");
dbmain.setup(__dirname + '/DBModels');

const app = express();

app.use(helmet());
app.set('view engine', 'hbs');

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.use('/propertyOwners', propertyOwners);
app.use('/admins', admins);

app.use('/appointments', appointments);
app.use('/applications', applications);
app.use('/images', images);

app.use('/propertyNeighborhoods', propertyNeighborhoods);
app.use('/auth/propertyOwnerAdmins', propertyOwnerAdminsAuth);
app.use('/auth/propertyAdmins', propertyAdminsAuth);
app.use('/auth/admins',adminAuth);
app.use('/payment/propertyAdmins', propertyAdminPayment);
app.use('/payment/properties', propertyCustomerPayment);
app.use('/payment/users', userPayment);
app.use('/properties', properties);
app.use('/propertyUnits', propertyUnits);
app.use('/inquiryLogs', inquiryLogs);
app.use('/users', users);
app.use('/auth/users', usersAuth);
app.use('/seed', seeder);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.render('error');
});


module.exports = app;
