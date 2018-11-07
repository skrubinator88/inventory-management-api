'use strict';

const dbmain = require('../../../config/DB/DBmain');

module.exports = {
    async getAllPropertyNeighborhoods (page, limit, query, cb) {
        let PropertyNeighborhood = dbmain.model('PropertyNeighborhood');
        let options = {
            where: query || {},
            limit: limit,
            offset: page
        };
        try {
            let response = [];
            let propertyNeighborhoods = await PropertyNeighborhood.findAll(options);
            for( let i = 0; i < propertyNeighborhoods.length; i++) {
                let obj = {};
                obj.id = propertyNeighborhoods[i].id;
                obj.name = propertyNeighborhoods[i].propertyNeighborhoodName;
                response.push(obj);
            }
            cb(null, response);
        } catch(err) {
            console.error(err);
            cb(err, null);
        }
    },
    async getPropertyOwnerAdminById (id, cb) {
        let PropertyOwnerAdmin = dbmain.model('PropertyOwnerAdmin');
        let PropertyOwner = dbmain.model('PropertyOwner');
        try{
            let propertyOwnerAdmin = await PropertyOwnerAdmin.findById(id);
            let propertyOwner = await PropertyOwner.findOne({ where: {id: propertyOwnerAdmin.PropertyOwnerId}});
            cb( null, {
                account: propertyOwner.name,
                id: propertyOwnerAdmin.id,
                email: propertyOwnerAdmin.email,
                phoneNumber: propertyOwnerAdmin.phoneNumber,
                accountId: propertyOwnerAdmin.PropertyOwnerId
            });
        } catch(err) {
            console.error(err);
            cb(err, null)
        }
    },
    async getPropertyOwnerAdmins (id, page, limit) {
        let options = {
            where: { PropertyOwnerId: id },
            limit: limit,
            offset: page
        };
        let PropertyOwnerAdmin = dbmain.model('PropertyOwnerAdmin');
        let Image = dbmain.model('Image');
        try {
            let response = [];
            let propertyAdmins = await PropertyOwnerAdmin.findAll(options);
            propertyAdmins.map(async propertyAdmin => {
                let obj = {};
                let profileImage = await Image.findAll({ where: { PropertyOwnerAdminId: id } });
                obj.profilePhoto = profileImage[0];
                obj.username = propertyAdmin.username;
                obj.email = propertyAdmin.email;
                obj.number = propertyAdmin.phoneNumber;
                response.push(obj);
            });
            return response;
        } catch (err) {
            console.error(err);
        }
    },
    async getProperties (id, page, limit, cb) {
        let options = {
            where: { PropertyOwnerId: id },
            limit: limit,
            offset: page
        };
        let Property = dbmain.model('Property');
        let Image = dbmain.model('Image');
        try {
            let response = [];
            let properties = await Property.findAll(options);
            for(let i = 0; i < properties.length; i++){
                let obj = {};
                let Images = [];
                await Image.findAll({ where: { PropertyId: properties[i].id } })
                    .then(images => {
                        Images.push.apply(Images, images)
                    })
                    .catch(err => {
                        throw err
                    });
                let propertyImages = [];
                for ( let i = 0; i < Images.length; i++) {
                    propertyImages.push(Images[i].ImgUrl)
                }
                obj.images = propertyImages;
                obj.id = properties[i].id;
                obj.name = properties[i].name;
                obj.email = properties[i].email;
                obj.number = properties[i].phoneNumber;
                response.push(obj);
            }
            cb(null, response);
        } catch (err) {
            console.error(err);
            cb(err);
        }
    },
    async getInvoices (id, page, limit, query, cb) {
        let Invoice = dbmain.model('Invoice');
        let Tenant = dbmain.model('User');
        let options = {
            where: query || {},
            limit: limit,
            offset: page
        };
        try {
            let response = [];
            let invoices = await Invoice.findAll(options);
            for( let i = 0; i < invoices.length; i++) {
                let obj = {};
                obj.id = invoices[i].id;
                obj.name = invoices[i].name;
                let userEmail = null;
                if(invoices[i].UserId) {
                    let tenant = await Tenant.findById(invoices[i].UserId);
                    userEmail = tenant.email;
                }
                obj.userEmail = userEmail;
                response.push(obj);
            }
            cb(null, response);
        } catch(err) {
            console.error(err);
            cb(err);
        }
    },
};