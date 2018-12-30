"use strict";
const { getAdmin } = require('../Controllers/queries');
//route used for retrieving a specific user
module.exports = async function (req, res, next) {
    let { adminId } = req.params;
    getAdmin(adminId, (err, admin) => {
        if(err) {
            return next(err)
        }
        res.status(200).send(admin)
    })
};