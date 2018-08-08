"use strict";
const queryController = require('../Controllers/queries');
//route used for retrieving a specific user
module.exports = async function (req, res) {
    let userId = parseInt(req.params.userId);
    if (Number.isNaN(userId)) {
        res.status(400).send({
            error: 'user id must be a number'
        });
        return;
    }
    try{
        let user = await queryController.getUserById(userId);
        if (user.emailAddress) {
            res.status(200).send(user)
        }
    } catch(err) {
        res.status(500).send({
            error: 'An error occurred trying to retrieve user'
        })
    }
};