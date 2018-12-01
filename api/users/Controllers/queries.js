'use strict';
const dbmain = require('../../../config/DB/DBmain');

module.exports = {
    async getAllUsers (page, limit, query) {
        let User = dbmain.model('User');
        let Image = dbmain.model('Image');
        let options = {
            where: query || {},
            limit: limit,
            offset: page
        };
        try{
            let response = [];
            let users;
            users = await User.findAll(options);
           users.map(async user => {
            let obj = {};
            obj.profilePhoto = (await Image.findAll({ where: { UserId: id } }))[0].ImgUrl;
            obj.firstName = user.firstName;
            obj.lastName = user.lastName;
            obj.emailAddress = user.email;
            obj.phone = user.phoneNumber;
            obj.payment = user.paymentInfo;
            obj.status = user.status;
            response.push(obj);
           });
           return response;
        } catch(err) {
            console.error(err);
        }
    },
    async getUserById (id, cb) {
        let User = dbmain.model('User');
        let Image = dbmain.model('Image');
        try{
            let user = await User.findById(id);
            // let userPhoto = await Image.findAll({ where: { UserId: id } });
            if(user) {
                return cb(null, {
                    emailAddress: user.email,
                    phone: user.phoneNumber,
                    gender: user.gender,
                    paymentInfo: user.paymentInfo,
                    status: user.status,
                    // photo: userPhoto[0].ImgUrl
                });
            } else {
                return cb(null, false)
            }
        } catch(err) {
            console.error(err);
            return cb(err);
        }
    },
    async getApplicationRequests(userId, cb) {
        let ApplicationRequest = dbmain.model('ApplicationRequest');
        let Property = dbmain.model('Property');
        try {
            let applicationRequests = await ApplicationRequest.findAll({ where: { UserId: userId } });
            let response = await Promise.all(applicationRequests.map(async applicationRequest => {
                let property = await Property.findById(applicationRequest.PropertyId);
                return {
                    propertyName: property.propertyName,
                    status: applicationRequest.status,
                    info: applicationRequest.description,
                    id: applicationRequest.id,
                    propertyId: property.id,
                    date: applicationRequest.createdAt,
                    userId: userId,
                    applicationFee: property.applicationFee
                }
            }));
            console.log(response);
            cb(null, response)
        } catch (err) {
            console.log(err);
            return cb(err)
        }
    },
    async getInvoices (id, page, limit) {
        let options = {
            where: { UserId: id },
            limit: limit,
            offset: page
        };
        let Invoice = dbmain.model('Invoice');
        try {
            let response = [];
            let invoices = await Invoice.findAll(options);
            invoices.map(async invoice => {
                let obj = {};
                obj.id = invoice.id;
                obj.file = invoice.filePath;
                response.push(obj);
            });
            return response;
        } catch (err) {
            console.error(err);
        }

    },
    async getAppointments (query, cb) {
        let options = {
            where: query
        };
        let Appointment = dbmain.model('Appointment');
        let PropertyUnit = dbmain.model('PropertyUnit');
        let Property = dbmain.model('Property');

        try {
            let appointments = await Appointment.findAll(options);
            let response = await Promise.all(appointments.map(async appointment => {
                let propertyUnit = await PropertyUnit.findById(appointment.PropertyUnitId);
                let property = await Property.findById(propertyUnit.PropertyId);
                let obj = {};
                obj.id = appointment.id;
                obj.date = appointment.date;
                obj.status = appointment.status;
                obj.info = appointment.description;
                obj.propertyUnitName = propertyUnit.propertyUnitName;
                obj.bedrooms = propertyUnit.bedroomAmount;
                obj.bathrooms = propertyUnit.bathroomAmount;
                obj.propertyUnitId = propertyUnit.id;
                if(propertyUnit.rentMin > 0 )
                    obj.rent = `$${propertyUnit.rentMin}`;
                if(propertyUnit.rentMax > 0 )
                    obj.rent = `${obj.rent} - ${propertyUnit.rentMax}`;
                obj.squareFeet = propertyUnit.squareFeet;
                obj.availability = propertyUnit.availability;
                obj.propertyName = property.propertyName;
                return obj;
            }));
            console.log(response)
            cb(null, response)
        } catch (err) {
            console.error(err);
            return cb(err)
        }

    }
};