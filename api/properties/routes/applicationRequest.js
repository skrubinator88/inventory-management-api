'use strict';
const { createApplicationRequest } = require('../Controllers/posts');
module.exports = async function (req, res, next) {
    let propertyId = req.params.propertyId;
    let updatedInfo = {};
    if(!(req.body.location) || !(req.body.creditScore) || !(req.body.budget)) {
        return res.status(400).send({
            error: 'Missing information'
        })
    }
    updatedInfo = Object.assign({}, updatedInfo,
        {
            creditScore: req.body.creditScore,
            budget: req.body.budget,
            location: req.body.location,
            userId: req.userId,
            propertyId: propertyId
        });
    createApplicationRequest(updatedInfo, function (err, applicationRequest) {
        if(err)
            return next(err);
        if(!applicationRequest)
            return res.status(304).send({
                message: 'application request has already been submitted'
            });
        console.log(applicationRequest);
        return res.status(200).json(applicationRequest);
    })
};