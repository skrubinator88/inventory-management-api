'use strict';

const dbmain = require('../../../config/DB/DBmain');
const Sequelize = require('sequelize');
const client = require('../../../bin/www');

module.exports = {
    async getAllProperties (page, limit, query, cb) {
        let Property = dbmain.model('Property');
        let Image = dbmain.model('Image');
        let Amenity = dbmain.model('Amenity');
        let Location = dbmain.model('Location');
        let options;
        if(query.location === true) {
            options = {
                where: {
                    ['$iLike']: {
                        ['$or']: [
                            Sequelize.literal(`\"Location\".\"state\" ILIKE '%${ query.query }%'`),
                            Sequelize.literal(`\"Location\".\"city\" ILIKE '%${ query.query }%'`),
                            Sequelize.literal(`\"Location\".\"streetAddress\" ILIKE '%${ query.query }%'`),
                        ],
                    },
                },
                limit: limit,
                offset: page,
                include: [
                    {
                        model: Location,
                        as: 'Location',
                        // attributes: ['city', 'state', 'streetAddress'],
                        required: true,
                    }
                ]
            };
        } else {
            options = {
                where: query || {},
                limit: limit,
                offset: page,
                order: [ [ Sequelize.fn('RANDOM') ] ]
            };
        }
        try {
            let properties = await Property.findAll(options);
            let response = await Promise.all( properties.map(async property => {
                let obj = {};
                let images = [];
                let propertyImages = [];
                let amenities = [];
                let location;
                await Image.findAll({ where: { PropertyId: property.id } })
                    .then(images => {
                        propertyImages = images
                    })
                    .catch(err => {
                        console.error(err);
                        throw err;
                    });
                for ( let i = 0; i < propertyImages.length; i++) {
                    images.push(propertyImages[i].ImgUrl);
                }
                await Amenity.findAll({ where: { PropertyId: property.id } })
                    .then(newAmenities => {
                        let AmenityFeature = dbmain.model('AmenityFeature');
                        newAmenities.map(async newAmenity => {
                            let amenity = newAmenity.get();
                            amenities.push(amenity.amenityName)
                        })
                    }).catch(err => {
                        console.error(err);
                        throw err;
                    });
                if(!query.location) {
                    await Location.findAll({ where: { PropertyId: property.id } })
                        .then(newLocation => {
                            let tempLocation = newLocation[0].get()
                            location = {
                                address: tempLocation.streetAddress,
                                city: tempLocation.city,
                                state: tempLocation.state,
                                zipCode: tempLocation.zipCode
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            throw err;
                        });
                }
                obj.id = property.id;
                obj.images = images;
                obj.amenities = amenities;
                obj.location = location || property.Location;
                obj.website = property.propertyWebsite;
                obj.name = property.propertyName;
                obj.email = property.propertyEmail;
                obj.number = property.propertyPhoneNumber;
                obj.rentMin = property.rentMin;
                obj.rentMax = property.rentMax;
                obj.applicationFee = property.applicationFee;
                // obj.address = properties[i].location;
                return obj;
            }));
           cb(null, response);
        } catch(err) {
            console.error(err);
            return cb(err)
        }
    },
    async getPropertyById (id, cb) {
        let Property = dbmain.model('Property');
        let Image = dbmain.model('Image');
        try{
            let property = await Property.findById(id);
            let propertyImages = [];
            await Image.findAll({ where: { PropertyId: id } })
                .then(images => {
                    propertyImages = images;
                }).catch(err => {
                    console.error(err);
                    throw err;
                });
            let images = [];
            for (let i = 0; i < propertyImages.length; i++) {
                images.push(propertyImages[i]);
            }
            cb(null, {
                id: property.id,
                images: images,
                name: property.propertyName,
                email: property.propertyEmail,
                number: property.propertyPhoneNumber,
                website: property.propertyWebsite
            });
        } catch(err) {
            console.error(err);
            cb(err)
        }
    },
    async getPropertyAdminById (id, cb) {
        let PropertyAdmin = dbmain.model('PropertyAdmin');
        let Property = dbmain.model('Property');
        let PaymentAccount = dbmain.model('PaymentAccount');
        try{
            let propertyAdmin = await PropertyAdmin.findById(id);
            let property = await Property.findOne({ where: {id: propertyAdmin.PropertyId}});
            let paymentAccount = await PaymentAccount.findOne({ where: { PropertyId: property.id }});
            let premiumCheck = false;
            let currentDate = new Date();
            if(propertyAdmin.premiumExpiryDate.getTime() > currentDate.getTime()) {
                premiumCheck = true;
            }
            let paymentAccountId;
            if(paymentAccount)
                paymentAccountId = paymentAccount.id;
            cb( null, {
                propertyAccount: property.propertyName,
                id: propertyAdmin.id,
                email: propertyAdmin.email,
                phoneNumber: propertyAdmin.phoneNumber,
                accountId: propertyAdmin.PropertyId,
                isPremium: premiumCheck,
                paymentAccount: paymentAccountId
            });
        } catch(err) {
            console.error(err);
            cb(err, null)
        }
    },
    async getTenants (opts, cb) {
        let Tenant = dbmain.model('User');
        let options = {
            where: opts.query,
            limit: opts.pageSize,
            offset: opts.page
        };
        try {
            let response = [];
            let tenants = await Tenant.findAll(options);
            for( let i = 0; i < tenants.length; i++) {
                let obj = {};
                obj.id = tenants[i].id;
                obj.name = tenants[i].firstName + ' ' + tenants[i].lastName;
                obj.email = tenants[i].email;
                obj.number = tenants[i].phoneNumber;
                response.push(obj);
            }
            response.push();
            cb(null, response);
        } catch(err) {
            console.error(err);
            cb(err, null);
        }
    },
    async getPropertyUnits (query, includeApp, page, limit, cb) {
        let PropertyUnit = dbmain.model('PropertyUnit');
        let Image = dbmain.model('Image');
        let Appointment = dbmain.model('Appointment');
        let User = dbmain.model('User');
        let include = [];
        if(includeApp === true) {
            let obj = {
                model: Appointment,
                required: true
            };
            include.push(obj);
        }
        let options = {
            where: query,
            limit: limit,
            offset: page,
            include: include
        };
        try {
            let response = [];
            let count = await PropertyUnit.count({ where: query });
            console.log(count / limit);
            let propertyUnits = await PropertyUnit.findAll(options);
            for(let i = 0; i < propertyUnits.length; i++) {
                let obj = {};
                let images = await Image.findAll({ where: { PropertyUnitId: propertyUnits[i].id } });
                let propertyImages = [];
                for( let i = 0; i < images.length; i++) {
                    propertyImages.push(images[i].ImgUrl)
                }
                if(includeApp === true) {
                    let appointments = [];
                    for(let x = 0; x < propertyUnits[i].Appointments.length; x++) {
                        let appointment = propertyUnits[i].Appointments[x];
                        let user = await User.findById(appointment.UserId)
                        let obj = {
                            userName: user.firstName + " " + user.lastName,
                            email: user.email,
                            date: appointment.date,
                            status: appointment.status,
                            id: appointment.id,
                            info: appointment.description
                        };
                        appointments.push(obj);
                    }
                    obj.appointments = appointments;
                }
                obj.id = propertyUnits[i].id;
                obj.images = propertyImages;
                obj.name = propertyUnits[i].name;
                obj.bedrooms = propertyUnits[i].bedroomAmount;
                obj.bathrooms = propertyUnits[i].bathroomAmount;
                if(propertyUnits[i].rentMin !== 0) {
                    obj.rent = `$${propertyUnits[i].rentMin}`
                }
                if(propertyUnits[i].rentMax !== 0) {
                    obj.rent = `${obj.rent} - $${propertyUnits[i].rentMax}`
                }
                obj.squareFeet = propertyUnits[i].squareFeet;
                obj.deposit = propertyUnits[i].depositAmount;
                obj.availability = propertyUnits[i].availability;
                let newCount = count / limit;
                if ((newCount % 2) !== 0) {
                    let n = newCount % 2
                    let countNum = 0
                    while (n > 1) {
                        n /= 10
                        countNum++
                    }
                    obj.count = newCount + countNum
                } else {
                    obj.count = newCount
                }
                obj.count = newCount;
                response.push(obj);
            }
            cb(null, response)
        } catch (err) {
            console.error(err);
            cb(err)
        }
    },
    async getInvoices (id, page, limit, cb) {
        let options = {
            where: { PropertyId: id },
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
            cb(null, response);
        } catch (err) {
            cb(err);
        }
    }, async getApplications(query, limit, page, cb) {
        let User = dbmain.model('User');
        let ApplicationRequest = dbmain.model('ApplicationRequest');
        try {
            let options = {
                where: query,
                limit: limit,
                offset: page
            };

            let applicationRequests = await ApplicationRequest.findAll(options);
            let response = await Promise.all(applicationRequests.map(async application => {
                let user = await User.findById(application.UserId);
                return {
                    id: application.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    creditScore: application.creditScore,
                    budget: application.budget,
                    location: application.location,
                    status: application.status,
                    date: application.createdAt
                }
            }));
            return cb(null, response)
        } catch (err) {
            return cb(err)
        }
    }
};