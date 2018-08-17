'use strict';

const dbmain = require('../../../config/DB/DBmain');

module.exports = {
    async getAllProperties (page, limit, query, cb) {
        let Property = dbmain.model('Property');
        let Image = dbmain.model('Image');
        let options = {
            where: query || {},
            limit: limit,
            offset: page
        };
        try {
            let response = [];
            let properties = await Property.findAll(options);
            for(let i = 0; i < properties.length; i++){
                let obj = {};
                let images = [];
                let propertyImages = [];
                await Image.findAll({ where: { PropertyId: properties[i].id } })
                    .then(images => {
                        propertyImages.push.apply(propertyImages, images)
                    })
                    .catch(err => {
                        console.error(err);
                        cb(err)
                    });
                for ( let i = 0; i < propertyImages.length; i++) {
                    images.push(propertyImages[i].ImgUrl);
                }
                obj.id = properties[i].id;
                obj.images = images;
                obj.name = properties[i].name;
                obj.email = properties[i].email;
                obj.number = properties[i].number;
                obj.address = properties[i].location;
                response.push(obj);
            }
           cb(null, response);
        } catch(err) {
            console.error(err);
            cb(err)
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
                name: property.name,
                email: property.email,
                number: property.phoneNumber
            });
        } catch(err) {
            console.error(err);
            cb(err)
        }
    },
    async getTenants (id, page, limit, query, cb) {
        let Tenant = dbmain.model('User');
        let options = {
            where: query || {},
            limit: limit,
            offset: page
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
    async getPropertyUnits (id, page, limit, cb) {
        let options = {
            where: { PropertyId: id },
            limit: limit,
            offset: page
        };
        let PropertyUnit = dbmain.model('PropertyUnit');
        let Image = dbmain.model('Image');
        try {
            let response = [];
            let propertyUnits = await PropertyUnit.findAll(options);
            for(let i = 0; i < propertyUnits.length; i++) {
                let obj = {};
                let images = await Image.findAll({ where: { PropertyUnitId: propertyUnits[i].id } });
                let propertyImages = [];
                for( let i = 0; i < images.length; i++) {
                    propertyImages.push(images[i].ImgUrl)
                }
                obj.id = propertyUnits[i].id;
                obj.images = propertyImages;
                obj.name = propertyUnits[i].name;
                obj.bedrooms = propertyUnits[i].bedroomAmount;
                obj.bathrooms = propertyUnits[i].bathroomAmount;
                obj.rent = propertyUnits[i].rentPrice;
                obj.squareFeet = propertyUnits[i].squareFeet;
                obj.deposit = propertyUnits[i].depositAmount;
                obj.availability = propertyUnits[i].availability;
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
    }
};