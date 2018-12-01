//index manifest file for all profile routes
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../Helpers/authMiddleware');

router.get('/:propertyId/chargeCustomer', authMiddleware, require('./chargeCustomer'));

module.exports = router;
