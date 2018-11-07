'use strict';
const queryController = require('../Controllers/queries');
module.exports = async function (req, res) {
    let barbershopId = parseInt(req.params.barbershopId);
    if (Number.isNaN(barbershopId)) {
        res.status(400).send({
            error: 'barber id must be a number'
        });
        return;
    }
    if (!(req.query.pageNo || req.query.pageLimit)) {
        res.status(400).send({
            error: 'pageNumber or pageLimit not specified'
        });
        return;
    }
    let pageLimit = parseInt(req.query.pageLimit);
    let pageNumber = (parseInt(req.query.pageNumber) - 1) * pageLimit;
    if (Number.isNaN(pageNumber) || Number.isNaN(pageLimit)) {
        res.status(400).send({
            error: 'pageNumber and pageLimit must both be numbers'
        });
        return;
    }
    let infoObject = {
        page: pageNumber,
        pageSize: pageLimit
    };
    try {
        let services = await queryController.getServices(barbershopId, infoObject.page, infoObject.pageSize);
        res.status(200).send(services);
    } catch (err) {
        res.status(500).send({
            error: 'An error occurred trying to retrieve services'
        });
    }
};