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
    async getUserById (id) {
        let User = dbmain.model('User');
        let Image = dbmain.model('Image');
        try{
            let user = await User.findById(id);
            let userPhoto = await Image.findAll({ where: { UserId: id } });
            return {
                emailAddress: user.email,
                phone: user.phoneNumber,
                gender: user.gender,
                payment: user.paymentInfo,
                status: user.status,
                photo: userPhoto[0].ImgUrl
            };
        } catch(err) {
            console.error(err);
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

    }
};