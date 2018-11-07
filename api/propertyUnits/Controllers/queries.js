'use strict';

const dbmain = require('../../../config/DB/DBmain');

module.exports = {
    async getAllPropertyUnits (page, limit, query) {
        let PropertyUnit = dbmain.model('PropertyUnit');
        let Image = dbmain.model('Image');
        let options = {
            where: query || {},
            limit: limit,
            offset: page
        };
        try {
            let response = [];
            let propertyUnits = await PropertyUnit.findAll(options);
            propertyUnits.map(async propertyUnit => {
                let obj = {};
                let images = [];
                let propertyImages = await Image.findAll({ where: { PropertyUnitId: id } });
                for ( let i = 0; i < propertyImages.length; i++) {
                    images.push(propertyImages[i]);
                }
                obj.id = propertyUnit.id;
                obj.images = images;
                obj.name = propertyUnit.name;
                obj.bedrooms = propertyUnit.bedroomAmount;
                obj.bathrooms = propertyUnit.bathroomAmount;
                obj.rent = propertyUnit.rentPrice;
                obj.squareFeet = propertyUnit.squareFeet;
                obj.deposit = propertyUnit.depositAmount;
                obj.availability = propertyUnit.availability;
                response.push(obj);
            });
            return response;
        } catch(err) {
            console.error(err);
        }
    },
    async getPropertyUnitById (id) {
        let PropertyUnit = dbmain.model('PropertyUnit');
        try {
            let propertyUnit = await PropertyUnit.findById(id);
            let propertyImages = await Image.findAll({ where: { PropertyUnitId: id } });
            let images = [];
            for (let i = 0; i < propertyImages.length; i++) {
                images.push(propertyImages[i]);
            }
            return {
                id: propertyUnit.id,
                images: images,
                name: propertyUnit.name,
                bedrooms: propertyUnit.bedroomAmount,
                bathrooms: propertyUnit.bathroomAmount,
                rent: propertyUnit.rentPrice,
                squareFeet: propertyUnit.squareFeet,
                deposit: propertyUnit.depositAmount,
                availability: propertyUnit.availability
            };
        } catch(err) {
            console.error(err);
        }
    }
};